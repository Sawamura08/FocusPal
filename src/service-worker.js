importScripts("ngsw-worker.js");

// Handle sync events
self.addEventListener("sync", async (event) => {
  if (event.tag === "SYNC-DATA") {
    event.waitUntil(fetchSession());
  }
});

const openDataBase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const fetchSession = async () => {
  try {
    console.log("here running");
    const db = await openDataBase();

    const transaction = db.transaction("userList", "readonly");
    const sessionList = transaction.objectStore("userList");

    const sessionRequest = sessionList.openCursor();

    sessionRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const session = cursor.value;
        console.log(session);
        return session.userName;
      } else {
        return "";
      }
    };

    sessionRequest.onerror = (event) => {
      console.error(
        "Error fetching data from IndexedDB:",
        event.target.errorCode
      );
    };
  } catch {
    console.error("Error opening database:", error);
  }
};

async function syncData() {
  const userName = fetchSession();
  const request = openDataBase();

  request.onerror = (event) => {
    console.error("Database failed to open", event);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction("taskList", "readonly");
    const tasklistStore = transaction.objectStore("taskList");

    const taskRequest = tasklistStore.openCursor();

    taskRequest.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        const task = cursor.value;

        if (task.isSync === 0 && task.isQueued === 0) {
          const updateTransaction = db.transaction("taskList", "readwrite");
          const updateStore = updateTransaction.objectStore("taskList");

          task.isQueued = 1;
          updateStore.put(task);

          console.log(
            "Task that is not synced:",
            JSON.stringify(task, null, 2)
          );

          fetch("http://192.168.1.6:7242/api/Task/createTask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Task Inserted Successfully", response.status);
                const updateTask = db.transaction("taskList", "readwrite");
                const updateTaskStore = updateTask.objectStore("taskList");

                task.isQueued = 0;
                task.isSync = 1;
                task.isUpdated = 1;
                updateTaskStore.put(task);
              } else {
                console.error("Failed to sync task:", response.status);
              }
            })
            .catch((error) => {
              console.error("Error syncing task:", error);
            });
        }

        cursor.continue();
      } else {
        console.log("Done");
      }
    };

    taskRequest.onerror = (event) => {
      console.error(
        "Error fetching data from IndexedDB:",
        event.target.errorCode
      );
    };
  };
}

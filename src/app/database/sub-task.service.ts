import { Injectable, VERSION } from '@angular/core';
import { liveQuery } from 'dexie';
import { db, Task, User, SubTasks } from './db';
import { subTaskTypes } from '../interfaces/Request';

@Injectable({
  providedIn: 'root',
})
export class SubTaskService {
  constructor() {}

  /* INSERT SUBTASK */

  public insertSubTask = async (task: Task) => {
    try {
      task.subTasks?.forEach(async (subTask) => {
        const newSubTask: SubTasks = {
          taskId: task.taskId!,
          taskSubtaskId: subTask.id,
          subTask: subTask.data,
          status: 0,
        };

        const subTaskId = await db.subTaskList.add(newSubTask);
        return subTaskId;
      });
    } catch {
      console.log('Error inserting Subtasks');
    }
  };

  /* GET ALL SUB TASK OF A SPECIFIC TASK */

  public getSubTaskData = async (taskId: number) => {
    try {
      const subTaskList = await db.subTaskList
        .where('taskId')
        .equals(taskId)
        .toArray();

      return subTaskList;
    } catch {
      console.log('Error on fetching Subtask');
      return [];
    }
  };

  /* UPDATE SUB TASK STATUS OF SPECIFIC TASK */
  public updateSubTaskStatus = async (subTaskData: SubTasks) => {
    try {
      const result = await db.subTaskList.update(
        subTaskData.subTaskId!,
        subTaskData
      );
      return result;
    } catch {
      console.log('Error on Upading Data!');
      return [];
    }
  };

  /* GET SPECIFIC SUBTASK BY UNIQUE ID */

  public getSubTaskById = async (id: number): Promise<SubTasks | undefined> => {
    try {
      const result = await db.subTaskList
        .where('taskSubtaskId')
        .equals(id)
        .first();

      return result;
    } catch {
      console.log('Error on fetching Subtask');
      return undefined;
    }
  };

  /* DELETE SPECIFIC SUBTASK */
  public deleteSubTaskById = async (id: number) => {
    await db.subTaskList.delete(id);
  };

  /* DELETE ALL SUBTASK SINCE TASK WAS DELETE */
  public deleteAllSubTaskByTaskId = async (id: number) => {
    await db.subTaskList.where('taskId').equals(id).delete();
  };

  public insertSubTaskOnUpdate = async (
    subtask: subTaskTypes,
    taskId: number
  ) => {
    try {
      const newSubTask: SubTasks = {
        taskId: taskId!,
        taskSubtaskId: subtask.id,
        subTask: subtask.data,
        status: 0,
      };
      const subTaskId = await db.subTaskList.add(newSubTask);
      return subTaskId;
    } catch {
      console.log('Error inserting new Subtask');
      return 0;
    }
  };
}

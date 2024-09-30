import { Injectable } from '@angular/core';

export enum syncType {
  SYNC_DATA,
  UPDATE_DATA,
  DELETE_DATA,
}

@Injectable({
  providedIn: 'root',
})
export class BackgroundSyncService {
  constructor() {}

  public backgroundSync = (type: syncType) => {
    navigator.serviceWorker.ready
      .then((swRegistration) => {
        const syncRegistration = swRegistration as ServiceWorkerRegistration & {
          sync?: any;
        };

        if (syncRegistration.sync) {
          return syncRegistration.sync.register(type);
        } else {
          console.error('Background Sync is not supported');
        }
      })
      .catch(console.log);
  };
}

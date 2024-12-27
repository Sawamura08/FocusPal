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

        console.log('attempt');
        if (syncRegistration.sync) {
          console.log('attempt sync');
          return syncRegistration.sync.register(type);
        } else {
          console.error('Background Sync is not supported');
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };
}

import { Injectable, signal } from '@angular/core';
import { db, User } from '../../../../database/db';
import { modalStatus } from '../../../../Objects/modal.details';
import { ResponseService } from '../../../../service/reponse.service';

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  constructor(protected response: ResponseService) {}

  public editProfileModalSignal = signal<boolean>(modalStatus.close);

  public setEditProfileModalStatus = (status: boolean) => {
    this.editProfileModalSignal.set(status);
  };

  public getEditProfileModalStatus = () => {
    return this.editProfileModalSignal();
  };

  public updateUserProfile = async (userInfo: User) => {
    try {
      const result = await db.userList.update(userInfo.userId, userInfo);

      return this.response.successResponse(result);
    } catch {
      return this.response.errorResponse();
    }
  };
}

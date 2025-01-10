import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { User } from '../../../../database/db';
import { EditProfileService } from './edit-profile.service';
import { modalStatus } from '../../../../Objects/modal.details';
import { GameUserDataService } from '../../../../database/game-user-data.service';
import { userGameData } from '../../../../interfaces/game.interface';
import { PopModalService } from '../../../../service/pop-modal.service';
import { catchError, combineLatest, firstValueFrom, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { confirm } from '../../../../interfaces/export.object';
import { updateRequest } from '../../../leaderboards/model/leaderboardClass';
import { LeaderboardsService } from '../../../../service/leaderboards.service';
import { slideRight } from '../../../../animation/slide-right.animate';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  animations: [slideRight],
})
export class EditProfileComponent implements OnInit {
  constructor(
    protected editProfile: EditProfileService,
    protected gameData: GameUserDataService,
    protected popModal: PopModalService,
    protected leader: LeaderboardsService
  ) {}

  ngOnInit(): void {
    this.setAvatar(this.currentAvatar!);
    this.getConfirmModal();
    this.setEditProfileData();
  }

  public isAnimation: boolean = true;
  public destroyRef = inject(DestroyRef);
  @Input() userInfo: User | undefined;
  public userName: string = '';
  public avatarFileNames: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  public isError!: boolean;
  /* FOR CHANGING avatar AND USERNAME*/
  public selectedAvatar: number | undefined;
  public currentAvatar: number | undefined;
  /* FOR MODAL */
  public editModalStatus!: boolean;
  public confirmationModalStatus!: boolean;
  public confirmTextData = confirm;
  public userConfirmationResponse!: boolean;

  /* FOR UPDATE DATA */
  public updateGameData!: userGameData;
  public updateUserData!: User;

  /* Set username and avatar initial value */
  public setEditProfileData = async () => {
    this.userName = this.userInfo?.userName ?? 'hello';

    const result = await this.gameData.fetchUserByID(this.userInfo?.userId!);
    if (result.value.userId != undefined) {
      this.updateGameData = structuredClone(result.value);
      this.currentAvatar = this.updateGameData.avatarID;
      this.selectedAvatar = this.currentAvatar;
    }
  };

  public setAvatarPath = (index: number) => {
    return `Avatars/${index}.png`;
  };

  public setAvatar = (index: number) => {
    this.selectedAvatar = index;
    this.currentAvatar = this.selectedAvatar;
  };

  public saveChanges = async () => {
    const userNameValid = this.checkWhiteSpace();
    if (
      this.userName != '' &&
      userNameValid &&
      this.selectedAvatar != undefined
    ) {
      this.setUpdateConfig();
      this.popModal.setConfirmaModalStatus(modalStatus.open);
      const userConfirmResponse = await this.getUserConfirmationReponse();

      if (userConfirmResponse) {
        const user = await this.userUpdate();
        const game = await this.userGameUpdate();

        if (user === 1 && game === 1) {
          this.updateDataOnServer();
        }
      }
    } else {
      this.isError = true;
    }
  };

  public checkWhiteSpace = () => {
    if (this.userName != undefined) {
      return this.userName.trim().length > 0 ? true : false;
    }
    return null;
  };

  public checkError = () => {
    const userNameValid = this.checkWhiteSpace();
    if (this.userName != '' && userNameValid) {
      this.isError = false;
    } else {
      this.isError = true;
    }
  };

  /* SET UP UPDATED DATA FOR SAVING */
  public setUpdateConfig = () => {
    /* USER INFO */
    this.updateUserData = structuredClone(this.userInfo!);
    this.updateUserData.userName = this.userName;

    /* USER GAME DATA INFO */
    this.updateGameData.avatarID = this.selectedAvatar!;
  };

  /* update user data INDEXEDB */
  public userUpdate = async () => {
    const result = await this.editProfile.updateUserProfile(
      this.updateUserData
    );

    return result.value;
  };

  public userGameUpdate = async () => {
    const result = await this.gameData.updateUserData(this.updateGameData);

    return result.value;
  };

  /* UPDATE THE DATA ON SERVER */
  public updateDataOnServer = () => {
    const updateData: updateRequest = {
      id: this.updateUserData.userId,
      userName: this.updateUserData.userName,
      points: this.updateGameData.currentExp,
      profile: `${this.updateGameData.avatarID}.png`,
    };

    this.leader
      .updateUserData(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.isAnimation = false;
        this.popModal.setConfirmaModalStatus(modalStatus.close);
        // wait until animation of close modal completes
        setTimeout(() => {
          this.editProfile.setEditProfileModalStatus(modalStatus.close);
        }, 400);
        window.location.reload();
      });
  };

  /* GET MODAL STATUS */
  public closeEditModal = () => {
    this.isAnimation = false;

    setTimeout(() => {
      this.editProfile.setEditProfileModalStatus(modalStatus.close);
    }, 400);
  };

  public getConfirmModal = () => {
    const updateConfirmation = this.popModal.getConfirmModalStatus();
    const closeModalConfirmation = this.popModal.getModalStatus();

    combineLatest([updateConfirmation, closeModalConfirmation])
      .pipe(
        catchError((err) => {
          console.error('Error Fetching Modal Status', err);
          return of(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ([confirmModal, closeModal]: any) => {
          this.confirmationModalStatus = confirmModal;
        },
      });
  };

  public getUserConfirmationReponse = async (): Promise<boolean> => {
    return firstValueFrom(
      this.popModal.getConfirmationModal().pipe(
        catchError((err) => {
          console.error("Can't fetch user response", err);
          return of(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
    );
  };
}

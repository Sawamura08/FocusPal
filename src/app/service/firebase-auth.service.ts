import { inject, Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  Auth,
} from '@angular/fire/auth';
import { ModalType, PopModalService } from './pop-modal.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(protected auth: Auth) {}

  public popModal = inject(PopModalService);
  public signUpAuthFirebase = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      sendEmailVerification(result.user).then(() => {
        this.popModal.openModal(ModalType.SUCCESSFUL);
      });
      return true;
    } catch (error: unknown) {
      // Cast error as FirebaseError
      if ((error as FirebaseError).code === 'auth/email-already-in-use') {
        this.popModal.openModal(ModalType.EMAIL_USED);
      } else if ((error as FirebaseError).code === 'auth/invalid-email') {
        this.popModal.openModal(ModalType.UNSUCCESSFUL);
      } else {
        console.error('An unknown error occurred:', error);
        alert('An unknown error occurred. Please try again.');
      }

      return false;
    }
  };
}

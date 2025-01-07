import { inject, Injectable, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
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

      this.sendEmail(result.user);
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

  public signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = userCredential.user;

      const emailResult = this.checkEmailVerification(user);
      //Object so it can also send the user firebase credentials info
      return { result: emailResult, user: user };
    } catch (err: unknown) {
      if ((err as FirebaseError).code === 'auth/invalid-credential') {
        this.popModal.openModal(ModalType.INCORRECT);
      } else {
        console.log('An error Occurred', err);
        this.popModal.openModal(ModalType.UNSUCCESSFUL);
      }

      return { result: false };
    }
  };

  public checkEmailVerification = (user: any) => {
    if (user.emailVerified) {
      return true; // Verified
    } else {
      this.popModal.openModal(ModalType.UNVERIFIED);
      return false; // unverified
    }
  };

  public sendEmail = (data: any) => {
    sendEmailVerification(data).then(() => {
      this.popModal.openModal(ModalType.SUCCESSFUL);
    });
  };

  /* RESEND VERIFICATION DATA SIGNAL */

  public resendVerificationSignal = signal<any>(undefined);

  public setUserDataCredential = (userData: any) => {
    this.resendVerificationSignal.set(userData);
  };

  public getUserCredential = () => {
    return this.resendVerificationSignal;
  };
}

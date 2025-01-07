import {
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

/* AbstractControl - defines general rules and properties of any form control 
    ValidatorFn - this checks each part of the house is built correctly*/

export function MatchPassValidator(
  controlName1: string,
  controlName2: string
): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control1 = formGroup.get(controlName1);
    const control2 = formGroup.get(controlName2);

    if (control1 && control2 && control1.value !== control2.value) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = control.value?.trim().length > 0;
    return isValid ? null : { whitespace: true };
  };
}

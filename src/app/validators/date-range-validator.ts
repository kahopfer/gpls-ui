import {Directive} from "@angular/core";
import {FormControl, NG_VALIDATORS} from "@angular/forms";

@Directive({
  selector: '[validateDateRange][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useValue: validateDateRange, multi: true }
  ]
})
export class DateRangeValidator{}

export function validateDateRange(c: FormControl) {
  let isValid: boolean;
  // If the value is null, then invalid. Else, if the first and second elements are not null, then valid
  c.value == null ? isValid = false : isValid = c.value[0] != null && c.value[1] != null;
  return isValid ? null : {
    validateDateRange: {
      valid: false
    }
  }
}

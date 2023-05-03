import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols/field-validation';

export class CompareFieldsValidation implements FieldValidation {
  constructor(readonly field: string, private readonly valueToCompare: string) {}

  validate(input: object): Error {
    return input[this.field] === input[this.valueToCompare]
      ? null
      : new InvalidFieldError();
  }
}

import {
  ValidationComposite,
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  CompareFieldsValidation,
} from '@/validation/validators';
import { makeSignupValidation } from '@/main/factories/pages/signup/signup-validation-factory';

describe('SignupValidationFactory', () => {
  test('should make ValidationComposite correct validations', () => {
    const composite = makeSignupValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        new RequiredFieldValidation('name'),
        new MinLengthValidation('name', 5),
        new RequiredFieldValidation('email'),
        new EmailValidation('email'),
        new RequiredFieldValidation('password'),
        new MinLengthValidation('password', 5),
        new RequiredFieldValidation('passwordConfirmation'),
        new CompareFieldsValidation('passwordConfirmation', 'password'),
      ]),
    );
  });
});

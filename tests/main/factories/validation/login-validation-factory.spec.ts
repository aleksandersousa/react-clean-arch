import {
  ValidationComposite,
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
} from '@/validation/validators';
import { makeLoginValidation } from '@/main/factories/pages/login/login-validation-factory';

describe('LoginValidationFactory', () => {
  test('should make ValidationComposite correct validations', () => {
    const composite = makeLoginValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        new RequiredFieldValidation('email'),
        new EmailValidation('email'),
        new RequiredFieldValidation('password'),
        new MinLengthValidation('password', 5),
      ]),
    );
  });
});

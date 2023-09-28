import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite';
import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
} from '@/validation/validators';
import { makeLoginValidation } from './login-validation-factory';

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

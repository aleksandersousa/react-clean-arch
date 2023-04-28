import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite';
import { ValidationBuilder } from '@/validation/validators';
import { makeLoginValidation } from './login-validation-factory';

describe('LoginValidationFactory', () => {
  test('should make ValidationComposite correct validations', () => {
    const composite = makeLoginValidation();
    expect(composite).toEqual(ValidationComposite.build([
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field('password').required().min(5).build(),
    ]));
  });
});

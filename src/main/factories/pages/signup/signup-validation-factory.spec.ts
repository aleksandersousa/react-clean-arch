import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite';
import { ValidationBuilder as Builder } from '@/validation/validators';
import { makeSignupValidation } from './signup-validation-factory';

describe('SignupValidationFactory', () => {
  test('should make ValidationComposite correct validations', () => {
    const composite = makeSignupValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...Builder.field('name').required().min(5).build(),
        ...Builder.field('email').required().email().build(),
        ...Builder.field('password').required().min(5).build(),
        ...Builder.field('passwordConfirmation').required().min(5).build(),
      ])
    );
  });
});

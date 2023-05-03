import { ValidationBuilder as Builder } from '@/validation/validators';
import { ValidationComposite } from '@/validation/validators/validation-composite/validation-composite';

export const makeSignupValidation = (): ValidationComposite =>
  ValidationComposite.build([
    ...Builder.field('name').required().min(5).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().min(5).build(),
    ...Builder.field('passwordConfirmation').required().sameAs('password').build(),
  ]);

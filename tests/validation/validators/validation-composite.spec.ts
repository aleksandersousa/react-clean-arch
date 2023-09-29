import { faker } from '@faker-js/faker';
import { FieldValidationSpy } from '@/tests/validation/mocks';
import { ValidationComposite } from '@/validation/validators';

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationsSpy: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];

  const sut = ValidationComposite.build(fieldValidationsSpy);

  return { sut, fieldValidationsSpy };
};

describe('ValidationComposite', () => {
  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column();
    const errorMessage = faker.word.words();
    const { sut, fieldValidationsSpy } = makeSut(fieldName);

    fieldValidationsSpy[0].error = new Error(errorMessage);
    fieldValidationsSpy[1].error = new Error(faker.word.words());

    const error = sut.validate(fieldName, { [fieldName]: faker.word.verb() });

    expect(error).toBe(errorMessage);
  });

  test('should return falsy if no validation field fails', () => {
    const fieldName = faker.database.column();
    const { sut } = makeSut(fieldName);

    const error = sut.validate(fieldName, { [fieldName]: faker.word.verb() });

    expect(error).toBeFalsy();
  });
});

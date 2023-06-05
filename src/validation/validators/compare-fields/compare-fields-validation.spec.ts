import { InvalidFieldError } from '@/validation/errors';
import { faker } from '@faker-js/faker';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (field: string, fieldToCompare: string) =>
  new CompareFieldsValidation(field, fieldToCompare);

describe('CompareFieldsValidation', () => {
  test('should return error if compare is invalid', () => {
    const field = faker.database.column();
    const fieldToCompare = faker.database.column();

    const sut = makeSut(field, fieldToCompare);
    const error = sut.validate({
      [field]: faker.word.words(3),
      [fieldToCompare]: faker.word.words(1),
    });

    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return falsy if compare is valid', () => {
    const field = faker.database.column();
    const fieldToCompare = faker.database.column();

    const sut = makeSut(field, fieldToCompare);
    const value = faker.word.verb();

    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    });

    expect(error).toBeFalsy();
  });
});

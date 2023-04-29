import { InvalidFieldError } from '@/validation/errors';
import { faker } from '@faker-js/faker';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (valueToCompare: string) =>
  new CompareFieldsValidation(faker.database.column(), valueToCompare);

describe('CompareFieldsValidation', () => {
  test('should return error if compare is invalid', () => {
    const sut = makeSut(faker.random.word());
    const error = sut.validate(faker.random.word());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return falsy compare is valid', () => {
    const valueToCompare = faker.random.word();
    const sut = makeSut(valueToCompare);
    const error = sut.validate(valueToCompare);

    expect(error).toBeFalsy();
  });
});

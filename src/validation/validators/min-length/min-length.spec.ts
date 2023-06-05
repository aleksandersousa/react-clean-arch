import { InvalidFieldError } from '@/validation/errors';
import { faker } from '@faker-js/faker';
import { MinLengthValidation } from './min-length-validation';

const makeSut = (field: string) => new MinLengthValidation(field, 5);

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.string.alphanumeric(4) });

    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return falsy if value is valid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.string.alphanumeric(5) });

    expect(error).toBeFalsy();
  });

  test('should return falsy if field does not exist in schema', () => {
    const sut = makeSut('any_field');
    const error = sut.validate({ invalidField: faker.string.alphanumeric(5) });

    expect(error).toBeFalsy();
  });
});

import { faker } from '@faker-js/faker';
import { InvalidFieldError } from '@/validation/errors';
import { EmailValidation } from '@/validation/validators';

const makeSut = (field: string) => new EmailValidation(field);

describe('first', () => {
  test('should return error if email is invalid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.word.verb() });

    expect(error).toEqual(new InvalidFieldError());
  });

  test('should return falsy if email is valid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.internet.email() });

    expect(error).toBeFalsy();
  });

  test('should return falsy if email is empty', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: '' });

    expect(error).toBeFalsy();
  });
});

import { faker } from '@faker-js/faker';
import 'jest-localstorage-mock';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = () => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => localStorage.clear());

  test('should call localstorage.setItem with correct values', () => {
    const sut = makeSut();

    const key = faker.database.column();
    const value = faker.helpers.objectEntry<AccountModel>(mockAccountModel());

    sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  test('should call localstorage.removeItem if value is null', () => {
    const sut = makeSut();

    const key = faker.database.column();

    sut.set(key, undefined);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('should call localstorage.getItem with correct value', () => {
    const sut = makeSut();

    const key = faker.database.column();
    const value = faker.helpers.objectEntry<AccountModel>(mockAccountModel());

    const getItemSpy = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value));
    const obj = sut.get(key);

    expect(obj).toEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });
});

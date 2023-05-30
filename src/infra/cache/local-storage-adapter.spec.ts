import { faker } from '@faker-js/faker';
import 'jest-localstorage-mock';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';
import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = () => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(() => localStorage.clear());

  test('should call localstorage with correct values', () => {
    const sut = makeSut();

    const key = faker.database.column();
    const value = faker.helpers.objectEntry<AccountModel>(mockAccountModel());

    sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });
});

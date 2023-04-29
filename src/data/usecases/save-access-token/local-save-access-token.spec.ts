import { faker } from '@faker-js/faker';
import { SetStorageMock } from '@/data/test';
import { LocalSaveAccessToken } from './local-save-access-token';

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);

  return { sut, setStorageMock };
};

describe('LocalSaveAccessToken', () => {
  test('should call set storage with correct value', async () => {
    const { sut, setStorageMock } = makeSut();
    const accessToken = faker.datatype.uuid();

    await sut.save(accessToken);

    expect(setStorageMock.key).toBe('accessToken');
    expect(setStorageMock.value).toBe(accessToken);
  });

  test('should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut();
    const error = new Error();

    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(error);

    const promise = sut.save(faker.datatype.uuid());

    await expect(promise).rejects.toThrow(error);
  });
});

import { HttpGetParams } from '@/data/protocols/http';
import { GetStorageSpy, HttpGetClientSpy, mockGetRequest } from '@/data/test';
import { mockAccountModel } from '@/domain/test';
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: AuthorizeHttpGetClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpGetClientSpy: HttpGetClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpGetClientSpy();
  const sut = new AuthorizeHttpGetClientDecorator(getStorageSpy, httpGetClientSpy);

  return { sut, getStorageSpy, httpGetClientSpy };
};

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();

    await sut.get(mockGetRequest());

    expect(getStorageSpy.key).toBe('account');
  });

  test('should not add headers if GetStorage is invalid', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: { field: faker.word.words() },
    };

    await sut.get(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('should not add headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
    };

    await sut.get(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('should merge headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const field = faker.word.words();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: { field },
    };

    await sut.get(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('should return the same result as HttpGetClient', async () => {
    const { sut, httpGetClientSpy } = makeSut();

    const httpResponse = await sut.get(mockGetRequest());

    expect(httpResponse).toEqual(httpGetClientSpy.response);
  });
});

import { HttpRequest } from '@/data/protocols/http';
import { GetStorageSpy, HttpClientSpy, mockRequest } from '@/data/test';
import { mockAccountModel } from '@/domain/test';
import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { faker } from '@faker-js/faker';

type SutTypes = {
  sut: AuthorizeHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpClientSpy = new HttpClientSpy();
  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpClientSpy);

  return { sut, getStorageSpy, httpClientSpy };
};

describe('Authorize HttpClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();

    await sut.request(mockRequest());

    expect(getStorageSpy.key).toBe('account');
  });

  test('should not add headers if GetStorage is invalid', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['post', 'get', 'put', 'delete']),
      headers: { field: faker.word.words() },
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('should not add headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['post', 'get', 'put', 'delete']),
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('should merge headers to HttpClient', async () => {
    const { sut, getStorageSpy, httpClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const field = faker.word.words();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.helpers.arrayElement(['post', 'get', 'put', 'delete']),
      headers: { field },
    };

    await sut.request(httpRequest);

    expect(httpClientSpy.url).toBe(httpRequest.url);
    expect(httpClientSpy.method).toBe(httpRequest.method);
    expect(httpClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('should return the same result as HttpClient', async () => {
    const { sut, httpClientSpy } = makeSut();

    const httpResponse = await sut.request(mockRequest());

    expect(httpResponse).toEqual(httpClientSpy.response);
  });
});

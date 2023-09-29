import { faker } from '@faker-js/faker';
import { HttpClientSpy } from '@/data/test';
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccountModel } from '@/domain/models';
import { mockAccountModel, mockAuthentication } from '@/domain/test';
import { RemoteAuthentication } from './remote-authentication';

type SutTypes = {
  sut: RemoteAuthentication;
  httpClientSpy: HttpClientSpy<AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<AccountModel>();
  const sut = new RemoteAuthentication(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('RemoteAuthentication', () => {
  test('should call HTTPClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    await sut.auth(mockAuthentication());

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
  });

  test('should call HTTPClient with correct body', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const authenticationParams = mockAuthentication();

    await sut.auth(authenticationParams);

    expect(httpClientSpy.body).toBe(authenticationParams);
  });

  test('should throw InvalidCredentialsError if HTTPClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized,
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test('should throw UnexpectedError if HTTPClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPClient return 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.auth(mockAuthentication());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return AccountModel if HTTPClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockAccountModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const account = await sut.auth(mockAuthentication());

    expect(account).toEqual(httpResult);
  });
});

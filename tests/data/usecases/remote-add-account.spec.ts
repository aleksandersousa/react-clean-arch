import { faker } from '@faker-js/faker';
import { HttpClientSpy } from '@/tests/data/mocks';
import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks';
import { AccountModel } from '@/domain/models';
import { EmailInUseError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { RemoteAddAccount } from '@/data/usecases';

type SutTypes = {
  sut: RemoteAddAccount;
  httpClientSpy: HttpClientSpy<AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<AccountModel>();
  const sut = new RemoteAddAccount(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('RemoteAddAccount', () => {
  test('should call HTTPClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    await sut.add(mockAddAccountParams());

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
  });

  test('should call HTTPClient with correct body', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);

    expect(httpClientSpy.body).toBe(addAccountParams);
  });

  test('should throw EmailInUseError if HTTPClient return 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test('should throw UnexpectedError if HTTPClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPClient return 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return AccountModel if HTTPClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockAccountModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const account = await sut.add(mockAddAccountParams());

    expect(account).toEqual(httpResult);
  });
});

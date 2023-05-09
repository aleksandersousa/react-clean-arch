import { HttpPostClientSpy } from '@/data/test';
import { AccountModel } from '@/domain/models';
import { faker } from '@faker-js/faker';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import { HttpStatusCode } from '@/data/protocols/http';
import { EmailInUserError, UnexpectedError } from '@/domain/errors';
import { RemoteAddAccount } from './remote-add-account';

type SutTypes = {
  sut: RemoteAddAccount;
  httpPostClientSpy: HttpPostClientSpy<AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel>();
  const sut = new RemoteAddAccount(url, httpPostClientSpy);

  return { sut, httpPostClientSpy };
};

describe('RemoteAddAccount', () => {
  test('should call HTTPPostClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);

    await sut.add(mockAddAccountParams());

    expect(httpPostClientSpy.url).toBe(url);
  });

  test('should call HTTPPostClient with correct body', async () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);
    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);

    expect(httpPostClientSpy.body).toBe(addAccountParams);
  });

  test('should throw EmailInUseError if HTTPPostClient return 403', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new EmailInUserError());
  });

  test('should throw UnexpectedError if HTTPPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HTTPPostClient return 500', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.add(mockAddAccountParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return AccountModel if HTTPPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut();
    const httpResult = mockAccountModel();

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const account = await sut.add(mockAddAccountParams());

    expect(account).toEqual(httpResult);
  });
});

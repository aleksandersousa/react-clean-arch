import { HttpPostClientSpy } from '@/data/test';
import { AddAccountParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { faker } from '@faker-js/faker';
import { mockAddAccountParams } from '@/domain/test';
import { RemoteAddAccount } from './remote-add-account';

type SutTypes = {
  sut: RemoteAddAccount;
  httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>();
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
});

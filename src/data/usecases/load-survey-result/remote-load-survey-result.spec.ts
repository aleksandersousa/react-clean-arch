import { HttpGetClientSpy } from '@/data/test';
import { SurveyResultModel } from '@/domain/models';
import { faker } from '@faker-js/faker';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError } from '@/domain/errors';
import { RemoteLoadSurveyResult } from './remote-load-survey-resul';

type SutTypes = {
  sut: RemoteLoadSurveyResult;
  httpGetClientSpy: HttpGetClientSpy<SurveyResultModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyResultModel>();
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy);

  return { sut, httpGetClientSpy };
};

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();

    const { sut, httpGetClientSpy } = makeSut(url);
    await sut.load();

    expect(httpGetClientSpy.url).toBe(url);
  });

  test('Should throw UnexpectedError if HTTPGetClient return 403', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.load();

    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });
});

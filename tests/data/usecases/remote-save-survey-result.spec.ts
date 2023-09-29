import { faker } from '@faker-js/faker';
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/tests/data/mocks';
import { mockSaveSurveyResultParams } from '@/tests/domain/mocks';
import { SurveyResultModel } from '@/domain/models';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { RemoteSaveSurveyResult } from '@/data/usecases';

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientSpy: HttpClientSpy<SurveyResultModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SurveyResultModel>();
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('RemoteLoadSurveyResult', () => {
  test('should call HttpClient with correct values', async () => {
    const url = faker.internet.url();
    const saveSurveyResultParams = mockSaveSurveyResultParams();

    const { sut, httpClientSpy } = makeSut(url);
    await sut.save(saveSurveyResultParams);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('put');
    expect(httpClientSpy.body).toEqual(saveSurveyResultParams);
  });

  test('Should throw AccessDeniedError if HTTPClient return 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.save(mockSaveSurveyResultParams());

    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should throw UnexpectedError if HTTPClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.save(mockSaveSurveyResultParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HTTPClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.save(mockSaveSurveyResultParams());

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return a SurveyResultModel if HTTPClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteSurveyResultModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const surveyResult = await sut.save(mockSaveSurveyResultParams());

    expect(surveyResult).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date),
    });
  });
});

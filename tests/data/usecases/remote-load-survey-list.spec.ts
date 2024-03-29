import { faker } from '@faker-js/faker';
import { HttpClientSpy, mockRemoteSurveyListModel } from '@/tests/data/mocks';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { SurveyModel } from '@/domain/models';
import { HttpStatusCode } from '@/data/protocols/http';
import { RemoteLoadSurveyList } from '@/data/usecases';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpClientSpy: HttpClientSpy<SurveyModel[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<SurveyModel[]>();
  const sut = new RemoteLoadSurveyList(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();

    const { sut, httpClientSpy } = makeSut(url);
    await sut.loadAll();

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('Should throw UnexpectedError if HTTPClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should throw UnexpectedError if HTTPClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HTTPClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return a list of SurveyModels if HTTPClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockRemoteSurveyListModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const surveyList = await sut.loadAll();

    expect(surveyList).toEqual([
      {
        id: httpResult[0].id,
        question: httpResult[0].question,
        answers: httpResult[0].answers,
        didAnswer: httpResult[0].didAnswer,
        date: new Date(httpResult[0].date),
      },
      {
        id: httpResult[1].id,
        question: httpResult[1].question,
        answers: httpResult[1].answers,
        didAnswer: httpResult[1].didAnswer,
        date: new Date(httpResult[1].date),
      },
      {
        id: httpResult[2].id,
        question: httpResult[2].question,
        answers: httpResult[2].answers,
        didAnswer: httpResult[2].didAnswer,
        date: new Date(httpResult[2].date),
      },
    ]);
  });

  test('Should return empty list if HTTPClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };

    const surveyList = await sut.loadAll();

    expect(surveyList).toEqual([]);
  });
});

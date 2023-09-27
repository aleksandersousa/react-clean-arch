import { HttpGetClientSpy, mockRemoteSurveyListModel } from '@/data/test';
import { faker } from '@faker-js/faker';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { HttpStatusCode } from '@/data/protocols/http';
import { SurveyModel } from '@/domain/models';
import { RemoteLoadSurveyList } from './remote-load-survey-list';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>();
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);

  return { sut, httpGetClientSpy };
};

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();

    const { sut, httpGetClientSpy } = makeSut(url);
    await sut.loadAll();

    expect(httpGetClientSpy.url).toBe(url);
  });

  test('Should throw UnexpectedError if HTTPGetClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should throw UnexpectedError if HTTPGetClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HTTPGetClient returns 500', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.loadAll();

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return a list of SurveyModels if HTTPGetClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpResult = mockRemoteSurveyListModel();

    httpGetClientSpy.response = {
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

  test('Should return empty list if HTTPGetClient returns 204', async () => {
    const { sut, httpGetClientSpy } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };

    const surveyList = await sut.loadAll();

    expect(surveyList).toEqual([]);
  });
});

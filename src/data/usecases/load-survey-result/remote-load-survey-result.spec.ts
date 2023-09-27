import { HttpGetClientSpy } from '@/data/test';
import { SurveyResultModel } from '@/domain/models';
import { faker } from '@faker-js/faker';
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
});

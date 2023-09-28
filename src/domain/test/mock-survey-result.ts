import { faker } from '@faker-js/faker';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases';

export const mockSurveyResultModel = (): SurveyResultModel => ({
  question: faker.word.words(10),
  date: faker.date.recent(),
  answers: [
    {
      image: faker.internet.url(),
      answer: faker.word.words(),
      count: faker.number.int(),
      percent: faker.number.float(100),
      isCurrentAccountAnswer: true,
    },
    {
      answer: faker.word.words(4),
      count: faker.number.int(),
      percent: faker.number.float(),
      isCurrentAccountAnswer: false,
    },
  ],
});

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0;
  surveyResult = mockSurveyResultModel();

  async load(): Promise<SurveyResultModel> {
    this.callsCount++;
    return this.surveyResult;
  }
}

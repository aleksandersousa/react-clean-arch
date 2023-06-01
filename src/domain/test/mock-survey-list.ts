import { faker } from '@faker-js/faker';
import { SurveyModel } from '@/domain/models';
import { LoadSurveyList } from '@/domain/usecases';

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.string.uuid(),
  question: faker.word.words(10),
  answers: [
    {
      image: faker.internet.avatar(),
      answer: faker.word.words(4),
    },
    {
      answer: faker.word.words(5),
    },
  ],
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent(),
});

export const mockSurveyListModel = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel(),
  mockSurveyModel(),
];

export class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveys;
  }
}

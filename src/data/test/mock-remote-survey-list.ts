import { faker } from '@faker-js/faker';
import { SurveyModel } from '@/domain/models';

export const mockRemoteSurveyModel = (): SurveyModel => ({
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
  date: faker.date.recent().toISOString(),
});

export const mockRemoteSurveyListModel = (): SurveyModel[] => [
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
];

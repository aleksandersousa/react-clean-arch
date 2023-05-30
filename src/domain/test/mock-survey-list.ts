import { faker } from '@faker-js/faker';
import { SurveyModel } from '../models';

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

import { faker } from '@faker-js/faker';
import { SurveyResultModel } from '@/domain/models';

export const mockRemoteSurveyResultModel = (): SurveyResultModel => ({
  question: faker.word.words(10),
  date: faker.date.recent().toISOString(),
  answers: [
    {
      image: faker.internet.url(),
      answer: faker.word.words(4),
      count: faker.number.int(),
      percent: faker.number.float(),
    },
    {
      answer: faker.word.words(4),
      count: faker.number.int(),
      percent: faker.number.float(),
    },
  ],
});

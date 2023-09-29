import { faker } from '@faker-js/faker';
import { SaveSurveyResultParams } from '@/domain/usecases';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  answer: faker.word.words(),
});

import { faker } from '@faker-js/faker';
import * as HttpHelper from './http-mocks';

export const mockEmailInUseError = (): void =>
  HttpHelper.mockForbiddenError(/signup/, 'POST');

export const mockUnexpectedError = (): void =>
  HttpHelper.mockServerError(/signup/, 'POST');

export const mockOk = (): void =>
  HttpHelper.mockOK(/signup/, 'POST', {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName(),
  });

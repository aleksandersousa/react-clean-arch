import { faker } from '@faker-js/faker';
import * as HttpHelper from './http-mocks';

export const mockInvalidCredentialsError = (): void =>
  HttpHelper.mockUnauthorizedError(/login/);

export const mockUnexpectedError = (): void =>
  HttpHelper.mockServerError(/login/, 'POST');

export const mockOk = (): void =>
  HttpHelper.mockOK(/login/, 'POST', {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName(),
  });

import { faker } from '@faker-js/faker';
import * as Helper from './http-mocks';

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/login/, 'POST');

export const mockOk = (): void =>
  Helper.mockOK(/login/, 'POST', {
    accessToken: faker.string.uuid(),
    name: faker.person.fullName(),
  });

export const mockInvalidBody = (): void =>
  Helper.mockOK(/login/, 'POST', {
    anyPropertyDifferentFromAccessToken: faker.string.uuid(),
  });

export const mockInvalidData = (): void =>
  Helper.mockOK(/login/, 'POST', { accessToken: undefined });

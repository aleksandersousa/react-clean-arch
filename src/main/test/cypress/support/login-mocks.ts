import { faker } from '@faker-js/faker';
import * as Helper from './http-mocks';

export const mockInvalidCredentialsError = (): void =>
  Helper.mockInvalidCredentialsError(/login/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/login/, 'POST');

export const mockOk = (): void =>
  Helper.mockOK(/login/, 'POST', { accessToken: faker.datatype.uuid() });

export const mockInvalidBody = (): void =>
  Helper.mockOK(/login/, 'POST', {
    anyPropertyDifferentFromAccessToken: faker.datatype.uuid(),
  });

export const mockInvalidData = (): void =>
  Helper.mockOK(/login/, 'POST', { accessToken: undefined });

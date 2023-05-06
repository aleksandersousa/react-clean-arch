import { faker } from '@faker-js/faker';
import * as Helper from './http-mocks';

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError(/signup/);

export const mockUnexpectedError = (): void =>
  Helper.mockUnexpectedError(/signup/, 'POST');

export const mockInvalidBody = (): void =>
  Helper.mockOK(/signup/, 'POST', {
    anyPropertyDifferentFromAccessToken: faker.datatype.uuid(),
  });

export const mockInvalidData = (): void =>
  Helper.mockOK(/signup/, 'POST', { accessToken: undefined });

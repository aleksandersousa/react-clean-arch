import * as HttpHelper from './http-mocks';

export const mockUnexpectedError = (): void =>
  HttpHelper.mockServerError(/surveys/, 'GET');
export const mockAccessDeniedError = (): void =>
  HttpHelper.mockForbiddenError(/surveys/, 'GET');

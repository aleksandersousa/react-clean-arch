import { faker } from '@faker-js/faker';

type Methods = 'POST' | 'PUT' | 'GET' | 'DELETE';

export const mockUnauthorizedError = (url: RegExp): void => {
  cy.intercept(
    {
      method: 'POST',
      url,
    },
    {
      statusCode: 401,
      body: {
        error: faker.word.words(),
      },
    },
  ).as('request');
};

export const mockServerError = (url: RegExp, method: Methods): void => {
  cy.intercept(
    {
      method,
      url,
    },
    {
      statusCode: faker.helpers.arrayElement([400, 404, 500]),
      body: {
        error: faker.word.words(),
      },
    },
  ).as('request');
};

export const mockForbiddenError = (url: RegExp, method: Methods): void => {
  cy.intercept(
    {
      method,
      url,
    },
    {
      statusCode: 403,
      body: {
        error: faker.word.words(),
      },
    },
  ).as('request');
};

export const mockOK = (
  url: RegExp,
  method: Methods,
  fixture: any,
  alias = 'request',
): void => {
  cy.intercept(
    {
      method,
      url,
    },
    {
      statusCode: 200,
      fixture,
    },
  ).as(alias);
};

import { faker } from '@faker-js/faker';
import * as Helper from '../support/helpers';
import * as HttpHelper from '../support/survey-list-mocks';

const { baseUrl } = Cypress.config();

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      accessToken: faker.string.uuid(),
      name: faker.person.fullName(),
    });
  });

  it('Should present error on UnexpectedError', () => {
    HttpHelper.mockUnexpectedError();
    cy.visit('');

    cy.getByTestId('error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );
  });

  it('Should logout on AccessDeniedError', () => {
    HttpHelper.mockAccessDeniedError();
    cy.visit('');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present correct username', () => {
    HttpHelper.mockUnexpectedError();
    cy.visit('');

    const { name } = Helper.getLocalStorageItem('account');
    cy.getByTestId('username').should('contain.text', name);
  });
});

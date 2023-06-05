import * as Helper from '../utils/helpers';
import * as Http from '../utils/http-mocks';

const { baseUrl } = Cypress.config();

const path = /surveys/;
const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET');
const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET');

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => {
      Helper.setLocalStorageItem('account', account);
    });
  });

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError();
    cy.visit('');

    cy.getByTestId('error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );
  });

  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError();
    cy.visit('');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present correct username', () => {
    mockUnexpectedError();
    cy.visit('');

    const { name } = Helper.getLocalStorageItem('account');
    cy.getByTestId('username').should('contain.text', name);
  });

  it('Should logout on logout link click', () => {
    mockUnexpectedError();
    cy.visit('');

    cy.getByTestId('logout').click();
    cy.url().should('eq', `${baseUrl as string}/login`);
  });
});
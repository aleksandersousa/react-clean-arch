import { faker } from '@faker-js/faker';
import { testInputStatus, testMainError } from '../utils/form-helpers';
import { testLocalStorageItem } from '../utils/helpers';
import * as Http from '../utils/http-mocks';

const { baseUrl } = Cypress.config();

const path = /login/;
const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(path);
const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST');
const mockSuccess = async (): Promise<void> => Http.mockOK(path, 'POST', 'account');

const populateFormFields = (): void => {
  cy.getByTestId('email').type(faker.internet.email());
  cy.getByTestId('password').type(faker.string.alphanumeric(5));
};

const simulateValidSubmit = (): void => {
  populateFormFields();
  cy.getByTestId('submit').click();
};

describe('Login', () => {
  beforeEach(() => cy.visit('/login'));

  it('Should load with correct initial state', () => {
    testInputStatus('email', 'Campo obrigatório');
    testInputStatus('password', 'Campo obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').type(faker.word.verb());
    testInputStatus('email', 'Valor inválido');

    cy.getByTestId('password').type(faker.string.alphanumeric(4));
    testInputStatus('password', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').type(faker.internet.email());
    testInputStatus('email');

    cy.getByTestId('password').type(faker.random.alphaNumeric(5));
    testInputStatus('password');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError();

    simulateValidSubmit();

    testMainError('Credenciais inválidas');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError on default error cases', () => {
    mockUnexpectedError();

    simulateValidSubmit();

    testMainError('Algo de inesperado aconteceu. Tente novamente em breve.');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should save account if valid credentials are provided', () => {
    mockSuccess();

    simulateValidSubmit();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('not.exist');

    cy.url().should('eq', `${baseUrl as string}/`);

    testLocalStorageItem('account');
  });

  it('Should prevent multiple submits', () => {
    mockSuccess();

    populateFormFields();
    cy.getByTestId('submit').dblclick();

    cy.get('@request.all').should('have.length', 1);
  });

  it('Should not call submit if form is invalid', () => {
    mockSuccess();

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('email').type('{enter}');

    cy.get('@request.all').should('have.length', 0);
  });
});

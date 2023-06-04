import { faker } from '@faker-js/faker';
import { testInputStatus, testMainError } from '../support/form-helpers';
import * as Http from '../support/login-mocks';
import { testLocalStorageItem } from '../support/helpers';

const { baseUrl } = Cypress.config();

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
    Http.mockInvalidCredentialsError();

    simulateValidSubmit();

    testMainError('Credenciais inválidas');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError on default error cases', () => {
    Http.mockUnexpectedError();

    simulateValidSubmit();

    testMainError('Algo de inesperado aconteceu. Tente novamente em breve.');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should save account if valid credentials are provided', () => {
    Http.mockOk();

    simulateValidSubmit();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('not.exist');

    cy.url().should('eq', `${baseUrl as string}/`);

    testLocalStorageItem('account');
  });

  it('Should prevent multiple submits', () => {
    Http.mockOk();

    populateFormFields();
    cy.getByTestId('submit').dblclick();

    cy.get('@request.all').should('have.length', 1);
  });

  it('Should not call submit if form is invalid', () => {
    Http.mockOk();

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('email').type('{enter}');

    cy.get('@request.all').should('have.length', 0);
  });
});

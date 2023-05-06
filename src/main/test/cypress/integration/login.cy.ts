import { faker } from '@faker-js/faker';
import {
  testInputStatus,
  testLocalStorageItem,
  testMainError,
} from '../support/form-helper';
import * as Http from './login-mocks';

const { baseUrl } = Cypress.config();

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').type(faker.internet.email());
  cy.getByTestId('password').type(faker.random.alphaNumeric(5));
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
    cy.getByTestId('email').type(faker.random.word());
    testInputStatus('email', 'Valor inválido');

    cy.getByTestId('password').type(faker.random.alphaNumeric(4));
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

  it('Should present UnexpectedError if invalid body is returned', () => {
    Http.mockInvalidBody();

    simulateValidSubmit();

    testMainError('Algo de inesperado aconteceu. Tente novamente em breve.');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    Http.mockInvalidData();

    simulateValidSubmit();

    testMainError('Algo de inesperado aconteceu. Tente novamente em breve.');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should save accessToken if valid credentials are provided', () => {
    Http.mockOk();

    simulateValidSubmit();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('not.exist');

    cy.url().should('eq', `${baseUrl as string}/`);

    testLocalStorageItem('accessToken');
  });

  it('Should prevent multiple submits', () => {
    Http.mockOk();

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));
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

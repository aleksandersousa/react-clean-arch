import { faker } from '@faker-js/faker';
import { testInputStatus, testMainError } from '../utils/form-helpers';
import * as Http from '../utils/http-mocks';
import { testLocalStorageItem } from '../utils/helpers';

const { baseUrl } = Cypress.config();

const path = /signup/;
const mockEmailInUseError = (): void => Http.mockForbiddenError(path, 'POST');
const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST');
const mockSuccess = (): void => {
  Http.mockOk(/api\/surveys/, 'GET', 'survey-list');
  Http.mockOk(path, 'POST', 'account', 'signUpRequest');
};

const populateFormFields = (): void => {
  cy.getByTestId('name').type(faker.person.fullName());
  cy.getByTestId('email').type(faker.internet.email());

  const password = faker.internet.password();
  cy.getByTestId('password').type(password);
  cy.getByTestId('passwordConfirmation').type(password);
};

const simulateValidSubmit = (): void => {
  populateFormFields();
  cy.getByTestId('submit').click();
};

describe('Signup', () => {
  beforeEach(() => cy.visit('/signup'));

  it('Should load with correct initial state', () => {
    testInputStatus('name', 'Campo obrigatório');
    testInputStatus('email', 'Campo obrigatório');
    testInputStatus('password', 'Campo obrigatório');
    testInputStatus('passwordConfirmation', 'Campo obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('name').type(faker.string.alphanumeric(4));
    testInputStatus('name', 'Valor inválido');

    cy.getByTestId('email').type(faker.word.verb());
    testInputStatus('email', 'Valor inválido');

    cy.getByTestId('password').type(faker.string.alphanumeric(4));
    testInputStatus('password', 'Valor inválido');

    cy.getByTestId('passwordConfirmation').type(faker.string.alphanumeric(3));
    testInputStatus('passwordConfirmation', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('name').type(faker.name.fullName());
    testInputStatus('name');

    cy.getByTestId('email').type(faker.internet.email());
    testInputStatus('email');

    const password = faker.internet.password();
    cy.getByTestId('password').type(password);
    testInputStatus('password');

    cy.getByTestId('passwordConfirmation').type(password);
    testInputStatus('passwordConfirmation');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present EmailInUseError on 403', () => {
    mockEmailInUseError();

    simulateValidSubmit();

    testMainError('Esse e-mail já está em uso');

    cy.url().should('eq', `${baseUrl as string}/signup`);
  });

  it('Should present UnexpectedError on default error cases', () => {
    mockUnexpectedError();

    simulateValidSubmit();

    testMainError('Algo de inesperado aconteceu. Tente novamente em breve.');

    cy.url().should('eq', `${baseUrl as string}/signup`);
  });

  it('Should store account on localStorage if valid credentials are provided', () => {
    mockSuccess();
    simulateValidSubmit();

    cy.url().should('eq', `${baseUrl as string}/`);

    testLocalStorageItem('account');
  });

  it('Should prevent multiple submits', () => {
    mockSuccess();

    populateFormFields();
    cy.getByTestId('submit').click();

    cy.wait('@signUpRequest');

    cy.get('@signUpRequest.all').should('have.length', 1);
  });

  it('Should not call submit if form is invalid', () => {
    mockSuccess();

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('email').type('{enter}');

    cy.get('@request.all').should('have.length', 0);
  });
});

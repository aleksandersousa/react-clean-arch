import { faker } from '@faker-js/faker';
import { testInputStatus, testMainError } from '../support/form-helper';
import * as Http from '../support/signup-mocks';

const { baseUrl } = Cypress.config();

const simulateValidSubmit = (): void => {
  cy.getByTestId('name').type(faker.name.fullName());
  cy.getByTestId('email').type(faker.internet.email());

  const password = faker.internet.password();
  cy.getByTestId('password').type(password);
  cy.getByTestId('passwordConfirmation').type(password);

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
    cy.getByTestId('name').type(faker.random.alphaNumeric(4));
    testInputStatus('name', 'Valor inválido');

    cy.getByTestId('email').type(faker.random.word());
    testInputStatus('email', 'Valor inválido');

    cy.getByTestId('password').type(faker.random.alphaNumeric(4));
    testInputStatus('password', 'Valor inválido');

    cy.getByTestId('passwordConfirmation').type(faker.random.alphaNumeric(3));
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
    Http.mockEmailInUseError();

    simulateValidSubmit();

    testMainError('Esse e-mail já está em uso');

    cy.url().should('eq', `${baseUrl as string}/signup`);
  });
});

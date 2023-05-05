import { faker } from '@faker-js/faker';

const { baseUrl } = Cypress.config();

describe('Login', () => {
  beforeEach(() => cy.visit('/login'));

  it('Should load with correct initial state', () => {
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid');
    cy.getByTestId('email').should('have.attr', 'title', 'Campo obrigatório');
    cy.getByTestId('email-label').should('have.attr', 'title', 'Campo obrigatório');

    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid');
    cy.getByTestId('password').should('have.attr', 'title', 'Campo obrigatório');
    cy.getByTestId('password-label').should('have.attr', 'title', 'Campo obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').type(faker.random.word());
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'invalid');
    cy.getByTestId('email').should('have.attr', 'title', 'Valor inválido');
    cy.getByTestId('email-label').should('have.attr', 'title', 'Valor inválido');

    cy.getByTestId('password').type(faker.random.alphaNumeric(4));
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'invalid');
    cy.getByTestId('password').should('have.attr', 'title', 'Valor inválido');
    cy.getByTestId('password-label').should('have.attr', 'title', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('email-wrap').should('have.attr', 'data-status', 'valid');
    cy.getByTestId('email').should('not.have.attr', 'title');
    cy.getByTestId('email-label').should('not.have.attr', 'title');

    cy.getByTestId('password').type(faker.random.alphaNumeric(5));
    cy.getByTestId('password-wrap').should('have.attr', 'data-status', 'valid');
    cy.getByTestId('password').should('not.have.attr', 'title');
    cy.getByTestId('password-label').should('not.have.attr', 'title');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');

    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present InvalidCredentialsError on 401', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 401,
        body: {
          error: faker.random.words(),
        },
      }
    );

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));

    cy.getByTestId('submit').click();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('contain.text', 'Credenciais inválidas');

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError on 400', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 400,
        body: {
          error: faker.random.words(),
        },
      }
    );

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));

    cy.getByTestId('submit').click();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError if invalid body is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          anyPropertyDifferentFromAccessToken: faker.datatype.uuid(),
        },
      }
    );

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));

    cy.getByTestId('submit').click();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          accessToken: undefined,
        },
      }
    );

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));
    cy.getByTestId('password').type('{enter}');

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );

    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should save accessToken if valid credentials are provided', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          accessToken: faker.datatype.uuid(),
        },
      }
    );

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));

    cy.getByTestId('submit').click();

    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('not.exist');

    cy.url().should('eq', `${baseUrl as string}/`);

    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')));
  });

  it('Should prevent multiple submits', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          accessToken: faker.datatype.uuid(),
        },
      }
    ).as('loginRequest');

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('password').type(faker.random.alphaNumeric(5));
    cy.getByTestId('submit').dblclick();

    cy.get('@loginRequest.all').should('have.length', 1);
  });

  it('Should not call submit if form is invalid', () => {
    cy.intercept(
      {
        method: 'POST',
        url: /login/,
      },
      {
        statusCode: 200,
        body: {
          accessToken: faker.datatype.uuid(),
        },
      }
    ).as('loginRequest');

    cy.getByTestId('email').type(faker.internet.email());
    cy.getByTestId('email').type('{enter}');

    cy.get('@loginRequest.all').should('have.length', 0);
  });
});

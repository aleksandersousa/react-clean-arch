const { baseUrl } = Cypress.config();

describe('Private Routes', () => {
  it('Should logout if survey list has no token', () => {
    cy.visit('');
    cy.url().should('eq', `${baseUrl as string}/login`);
  });

  it('Should logout if survey result has no token', () => {
    cy.visit('/surveys/any_id');
    cy.url().should('eq', `${baseUrl as string}/login`);
  });
});

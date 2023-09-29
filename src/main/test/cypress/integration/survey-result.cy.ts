import * as Helper from '../utils/helpers';
import * as Http from '../utils/http-mocks';

const { baseUrl } = Cypress.config();

const path = /surveys/;

const mockLoadSuccess = (): void => Http.mockOK(path, 'GET', 'survey-result');

describe('SurveyResult', () => {
  describe('load', () => {
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET');
    const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET');

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account);
      });
    });

    it('Should present error on UnexpectedError', () => {
      cy.visit('/surveys/any_id');
      mockUnexpectedError();

      cy.getByTestId('error').should(
        'contain.text',
        'Algo de inesperado aconteceu. Tente novamente em breve.',
      );
    });

    it('Should reload on button click', () => {
      cy.visit('/surveys/any_id');
      mockUnexpectedError();

      cy.getByTestId('error').should(
        'contain.text',
        'Algo de inesperado aconteceu. Tente novamente em breve.',
      );

      mockLoadSuccess();
      cy.getByTestId('reload').click();
      cy.getByTestId('question').should('exist');
    });

    it('Should logout on AccessDeniedError', () => {
      cy.visit('/surveys/any_id');
      mockAccessDeniedError();

      cy.url().should('eq', `${baseUrl as string}/login`);
    });

    it('Should present survey result', () => {
      cy.visit('/surveys/any_id');
      mockLoadSuccess();

      cy.getByTestId('question').should('have.text', 'Question');

      cy.getByTestId('day').should('have.text', '03');
      cy.getByTestId('month').should('have.text', 'fev');
      cy.getByTestId('year').should('have.text', '2018');

      cy.get('li:nth-child(1)').then(li => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'Answer 1');
        assert.equal(li.find('[data-testid="percent"]').text(), '70%');
        assert.equal(li.find('[data-testid="image"]').attr('src'), 'http://image.com');
      });
      cy.get('li:nth-child(2)').then(li => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'Answer 2');
        assert.equal(li.find('[data-testid="percent"]').text(), '30%');
        assert.notExists(li.find('[data-testid="image"]'));
      });
    });

    it('Should go to SurveyList on back button click', () => {
      cy.visit('/surveys/any_id');
      mockLoadSuccess();

      cy.getByTestId('back-button').click();
      cy.url().should('eq', `${baseUrl as string}/`);
    });
  });

  describe('save', () => {
    const mockUnexpectedError = (): void => Http.mockServerError(path, 'PUT');
    const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'PUT');

    beforeEach(() => {
      cy.fixture('account').then(account => {
        Helper.setLocalStorageItem('account', account);
      });
      cy.visit('/surveys/any_id');
      mockLoadSuccess();
    });

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError();

      cy.get('li:nth-child(2)').click();

      cy.getByTestId('error').should(
        'contain.text',
        'Algo de inesperado aconteceu. Tente novamente em breve.',
      );
    });

    it('Should logout on AccessDeniedError', () => {
      mockAccessDeniedError();

      cy.get('li:nth-child(2)').click();

      cy.url().should('eq', `${baseUrl as string}/login`);
    });
  });
});

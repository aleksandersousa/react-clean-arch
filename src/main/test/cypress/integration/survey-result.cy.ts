import * as Helper from '../utils/helpers';
import * as Http from '../utils/http-mocks';

// const { baseUrl } = Cypress.config();

const path = /surveys/;
const mockUnexpectedError = (): void => Http.mockServerError(path, 'GET');
// const mockAccessDeniedError = (): void => Http.mockForbiddenError(path, 'GET');
// const mockSuccess = (): void => Http.mockOK(path, 'GET', 'survey-list');

describe('SurveyResult', () => {
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
});

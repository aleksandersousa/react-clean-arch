import { faker } from '@faker-js/faker';
import * as Helper from '../support/helpers';
import * as HttpHelper from '../support/survey-list-mocks';

describe('SurveyList', () => {
  beforeEach(() => {
    Helper.setLocalStorageItem('account', {
      accessToken: faker.string.uuid(),
      name: faker.person.fullName(),
    });
  });

  it('Should present error on UnexpectedError', () => {
    HttpHelper.mockUnexpectedError();
    cy.visit('');

    cy.getByTestId('error').should(
      'contain.text',
      'Algo de inesperado aconteceu. Tente novamente em breve.'
    );
  });
});

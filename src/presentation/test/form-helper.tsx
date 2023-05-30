import { faker } from '@faker-js/faker';
import { fireEvent, screen } from '@testing-library/react';

export const testStatusForField = (fieldName: string, validationError = ''): void => {
  const fieldWrap = screen.getByTestId(`${fieldName}-wrap`);
  const field = screen.getByTestId(fieldName);
  const fieldLabel = screen.getByTestId(`${fieldName}-label`);

  expect(fieldWrap).toHaveAttribute('data-status', validationError ? 'invalid' : 'valid');
  expect(field).toHaveProperty('title', validationError);
  expect(fieldLabel).toHaveProperty('title', validationError);
};

export const populateField = (fieldName: string, value = faker.word.verb()): void => {
  const input = screen.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

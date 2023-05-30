/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { faker } from '@faker-js/faker';
import { fireEvent, screen } from '@testing-library/react';

export const testChildCount = (fieldName: string, count: number): void => {
  const el = screen.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (fieldName: string, isDisabled: boolean): void => {
  const button = screen.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (fieldName: string, validationError = ''): void => {
  const fieldWrap = screen.getByTestId(`${fieldName}-wrap`);
  const field = screen.getByTestId(fieldName);
  const fieldLabel = screen.getByTestId(`${fieldName}-label`);

  expect(fieldWrap.getAttribute('data-status')).toBe(
    validationError ? 'invalid' : 'valid'
  );
  expect(field.title).toBe(validationError);
  expect(fieldLabel.title).toBe(validationError);
};

export const testElementExists = (fieldName: string): void => {
  const el = screen.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

export const populateField = (fieldName: string, value = faker.word.verb()): void => {
  const input = screen.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

export const testElementText = (fieldName: string, text: string): void => {
  const el = screen.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};

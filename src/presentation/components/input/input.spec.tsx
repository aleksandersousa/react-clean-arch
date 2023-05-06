import React from 'react';
import { RenderResult, fireEvent, render } from '@testing-library/react';
import FormContext from '@/presentation/contexts/form/form-context';
import { faker } from '@faker-js/faker';
import Input from './Input';

const makeSut = (fieldName: string): RenderResult =>
  render(
    <FormContext.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </FormContext.Provider>
  );

describe('InputComponent', () => {
  test('should focus input on label click', () => {
    const field = faker.database.column();
    const sut = makeSut(field);

    const input = sut.getByTestId(field);
    const label = sut.getByTestId(`${field}-label`);
    fireEvent.click(label);

    expect(document.activeElement).toBe(input);
  });
});

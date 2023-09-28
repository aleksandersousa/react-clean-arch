import { RenderResult, fireEvent, render } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { FormContext } from '@/presentation/contexts';
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

import React from 'react';
import {
  RenderResult, cleanup, fireEvent, render,
} from '@testing-library/react';
import { Validation } from '@/presentation/protocols/validation';
import Login from './Login';

class ValidationSpy implements Validation {
  errorMessage: string;
  input: object;

  validate(input: object): string {
    this.input = input;
    return this.errorMessage;
  }
}

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = render(<Login validation={validationSpy} />);

  return { sut, validationSpy };
};

describe('Login Page', () => {
  afterEach(cleanup);

  test('should not render Spinner and error on start', () => {
    const { sut } = makeSut();

    const errorWrap = sut.getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(0);
  });

  test('should show submit button disabled on start', () => {
    const { sut } = makeSut();

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  test('should inputs start with initial state', () => {
    const { sut } = makeSut();

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement;
    expect(emailStatus.title).toBe('Campo obrigatório');
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status') as HTMLButtonElement;
    expect(passwordStatus.title).toBe('Campo obrigatório');
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should call Validation with correct values', () => {
    const { sut, validationSpy } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: 'any_email' } });
    expect(validationSpy.input).toEqual({ email: 'any_email' });
  });
});

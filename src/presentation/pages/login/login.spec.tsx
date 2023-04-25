import React from 'react';
import {
  RenderResult, cleanup, fireEvent, render,
} from '@testing-library/react';
import { ValidationSpy } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import Login from './Login';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  validationSpy.errorMessage = faker.random.words();

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
    const { sut, validationSpy } = makeSut();

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement;
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status') as HTMLButtonElement;
    expect(passwordStatus.title).toBe('');
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should call Validation with correct email', () => {
    const { sut, validationSpy } = makeSut();
    const email = faker.internet.email();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: email } });

    expect(validationSpy.fieldName).toEqual('email');
    expect(validationSpy.fieldValue).toEqual(email);
  });

  test('should call Validation with correct password', () => {
    const { sut, validationSpy } = makeSut();
    const password = faker.internet.password();

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: password } });

    expect(validationSpy.fieldName).toEqual('password');
    expect(validationSpy.fieldValue).toEqual(password);
  });

  test('should show email error if Validation fails', () => {
    const { sut, validationSpy } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });
});

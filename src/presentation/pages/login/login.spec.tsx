import React from 'react';
import {
  RenderResult, cleanup, fireEvent, render,
} from '@testing-library/react';
import { ValidationStub } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import Login from './Login';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationStub();
  validationSpy.errorMessage = faker.random.words();

  const sut = render(<Login validation={validationSpy} />);

  return { sut, validationStub: validationSpy };
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
    const { sut, validationStub: validationSpy } = makeSut();

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement;
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status') as HTMLButtonElement;
    expect(passwordStatus.title).toBe(validationSpy.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should show email error if Validation fails', () => {
    const { sut, validationStub: validationSpy } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('should show password error if Validation fails', () => {
    const { sut, validationStub: validationSpy } = makeSut();

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationSpy.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });
});

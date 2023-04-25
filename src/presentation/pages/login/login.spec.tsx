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

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const sut = render(<Login validation={validationStub} />);

  return { sut, validationStub };
};

describe('Login Page', () => {
  afterEach(cleanup);

  test('should not render Spinner and error on start', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });

    const errorWrap = sut.getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(0);
  });

  test('should show submit button disabled on start', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  test('should inputs start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement;
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status') as HTMLButtonElement;
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('should show valid email state if Validation succeds', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe('Tudo certo!');
    expect(emailStatus.textContent).toBe('🟢');
  });

  test('should show valid password state if Validation succeds', () => {
    const { sut } = makeSut();

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe('Tudo certo!');
    expect(passwordStatus.textContent).toBe('🟢');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test('should show spinner on submit', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButton = sut.getByTestId('submit');
    fireEvent.click(submitButton);

    const spinner = sut.getByTestId('spinner');
    expect(spinner).toBeTruthy();
  });
});

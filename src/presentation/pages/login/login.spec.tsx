import React from 'react';
import {
  RenderResult, cleanup, fireEvent, render,
} from '@testing-library/react';
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import Login from './Login';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />,
  );

  return { sut, authenticationSpy };
};

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email');
  fireEvent.input(emailInput, { target: { value: email } });
};

const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password(),
): void => {
  const passwordInput = sut.getByTestId('password');
  fireEvent.input(passwordInput, { target: { value: password } });
};

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string,
): void => {
  const emailStatus = sut.getByTestId(`${fieldName}-status`);
  expect(emailStatus.title).toBe(validationError || 'Tudo certo!');
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password(),
): void => {
  populateEmailField(sut, email);

  populatePasswordField(sut, password);

  const submitButton = sut.getByTestId('submit');
  fireEvent.click(submitButton);
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

    simulateStatusForField(sut, 'email', validationError);
    simulateStatusForField(sut, 'password', validationError);
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    simulateStatusForField(sut, 'email', validationError);
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    simulateStatusForField(sut, 'password', validationError);
  });

  test('should show valid email state if Validation succeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    simulateStatusForField(sut, 'email');
  });

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    simulateStatusForField(sut, 'password');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test('should show spinner on submit', () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    const spinner = sut.getByTestId('spinner');
    expect(spinner).toBeTruthy();
  });

  test('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();

    simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut();

    simulateValidSubmit(sut);
    simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });
});

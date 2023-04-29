/* eslint-disable comma-dangle */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';
import { faker } from '@faker-js/faker';
import {
  AuthenticationSpy,
  ValidationStub,
  SaveAccessTokenMock,
  Helper,
} from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { Login } from '@/presentation/pages';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <BrowserRouter>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </BrowserRouter>
  );

  return { sut, authenticationSpy, saveAccessTokenMock };
};

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email');
  fireEvent.input(emailInput, { target: { value: email } });
};

const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId('password');
  fireEvent.input(passwordInput, { target: { value: password } });
};

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};

const startInRoute = (routeName: string): void => {
  window.history.pushState({}, 'Test page', routeName);
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);

  const form = sut.getByTestId('form');
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe('Login Page', () => {
  afterEach(cleanup);

  test('should not render Spinner and error on start', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });

    Helper.testChildCount(sut, 'error-wrap', 0);
  });

  test('should show submit button disabled on start', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });

    Helper.testButtonIsDisabled(sut, 'submit', true);
  });

  test('should inputs start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('should show valid email state if Validation succeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    Helper.testStatusForField(sut, 'email');
  });

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    Helper.testStatusForField(sut, 'password');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    Helper.testButtonIsDisabled(sut, 'submit', false);
  });

  test('should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    testElementExists(sut, 'spinner');
  });

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();

    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error));

    await simulateValidSubmit(sut);

    testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });

  test('should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();

    startInRoute('/login');

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken);
    expect(window.location.pathname).toBe('/');
  });

  test('should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new InvalidCredentialsError();

    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error));

    await simulateValidSubmit(sut);

    testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });

  test('should go to signup page', () => {
    const { sut } = makeSut();

    startInRoute('/login');

    const register = sut.getByTestId('signup');
    fireEvent.click(register);

    expect(window.location.pathname).toBe('/signup');
  });
});

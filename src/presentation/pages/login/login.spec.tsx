/* eslint-disable comma-dangle */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import {
  AuthenticationSpy,
  ValidationStub,
  Helper,
  UtilsHelper,
} from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { Login } from '@/presentation/pages';
import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';

type SutTypes = {
  authenticationSpy: AuthenticationSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();
  const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </BrowserRouter>
    </ApiContext.Provider>
  );

  return { authenticationSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField('email', email);
  Helper.populateField('password', password);

  const form = screen.getByTestId('form');
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe('Login Page', () => {
  test('should not render Spinner and error on start', () => {
    makeSut({ validationError: faker.word.words() });

    expect(screen.getByTestId('error-wrap').children).toHaveLength(0);
  });

  test('should show submit button disabled on start', () => {
    makeSut({ validationError: faker.word.words() });

    expect(screen.getByTestId('submit')).toBeDisabled();
  });

  test('should inputs start with initial state', () => {
    const validationError = faker.word.words();
    makeSut({ validationError });

    Helper.testStatusForField('email', validationError);
    Helper.testStatusForField('password', validationError);
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.word.words();
    makeSut({ validationError });

    Helper.populateField('email');

    Helper.testStatusForField('email', validationError);
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.word.words();
    makeSut({ validationError });

    Helper.populateField('password');

    Helper.testStatusForField('password', validationError);
  });

  test('should show valid email state if Validation succeds', () => {
    makeSut();

    Helper.populateField('email');

    Helper.testStatusForField('email');
  });

  test('should show valid password state if Validation succeeds', () => {
    makeSut();

    Helper.populateField('password');

    Helper.testStatusForField('password');
  });

  test('should enable submit button if form is valid', () => {
    makeSut();

    Helper.populateField('email');
    Helper.populateField('password');

    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  test('should show spinner on submit', async () => {
    makeSut();

    await simulateValidSubmit();

    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  test('should call Authentication with correct values', async () => {
    const { authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut();

    await simulateValidSubmit();
    await simulateValidSubmit();

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.word.words();
    const { authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit();

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);

    await simulateValidSubmit();

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
  });

  test('should call SaveAccessToken on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut();

    UtilsHelper.startInRoute('/login');

    await simulateValidSubmit();

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
    expect(window.location.pathname).toBe('/');
  });

  test('should go to signup page', () => {
    makeSut();

    UtilsHelper.startInRoute('/login');

    const registerLink = screen.getByTestId('signup-link');
    fireEvent.click(registerLink);

    expect(window.location.pathname).toBe('/signup');
  });
});

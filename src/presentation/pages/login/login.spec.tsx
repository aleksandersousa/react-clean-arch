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
  Helper,
  UtilsHelper,
} from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { Login } from '@/presentation/pages';
import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';

type SutTypes = {
  sut: RenderResult;
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

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </BrowserRouter>
    </ApiContext.Provider>
  );

  return { sut, authenticationSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, 'email', email);
  Helper.populateField(sut, 'password', password);

  const form = sut.getByTestId('form');
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe('Login Page', () => {
  afterEach(cleanup);

  test('should not render Spinner and error on start', () => {
    const { sut } = makeSut({ validationError: faker.word.words() });

    Helper.testChildCount(sut, 'error-wrap', 0);
  });

  test('should show submit button disabled on start', () => {
    const { sut } = makeSut({ validationError: faker.word.words() });

    Helper.testButtonIsDisabled(sut, 'submit', true);
  });

  test('should inputs start with initial state', () => {
    const validationError = faker.word.words();
    const { sut } = makeSut({ validationError });

    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('should show email error if Validation fails', () => {
    const validationError = faker.word.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('should show password error if Validation fails', () => {
    const validationError = faker.word.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('should show valid email state if Validation succeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email');
  });

  test('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'email');
    Helper.populateField(sut, 'password');

    Helper.testButtonIsDisabled(sut, 'submit', false);
  });

  test('should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    Helper.testElementExists(sut, 'spinner');
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
    const validationError = faker.word.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);

    await simulateValidSubmit(sut);

    Helper.testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });

  test('should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, setCurrentAccountMock } = makeSut();

    UtilsHelper.startInRoute('/login');

    await simulateValidSubmit(sut);

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
    expect(window.location.pathname).toBe('/');
  });

  test('should go to signup page', () => {
    const { sut } = makeSut();

    UtilsHelper.startInRoute('/login');

    const registerLink = sut.getByTestId('signup-link');
    fireEvent.click(registerLink);

    expect(window.location.pathname).toBe('/signup');
  });
});

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react';
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test';
import { faker } from '@faker-js/faker';
import { EmailInUseError } from '@/domain/errors';
import { AccountModel } from '@/domain/models';
import { ApiContext } from '@/presentation/contexts';
import Signup from './Signup';

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const addAccountSpy = new AddAccountSpy();
  const setCurrentAccountMock = jest.fn();

  const sut = render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
        <Signup validation={validationStub} addAccount={addAccountSpy} />
      </BrowserRouter>
    </ApiContext.Provider>
  );

  return { sut, addAccountSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  name = faker.person.firstName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, 'name', name);
  Helper.populateField(sut, 'email', email);
  Helper.populateField(sut, 'password', password);
  Helper.populateField(sut, 'passwordConfirmation', password);

  const form = sut.getByTestId('form');
  fireEvent.submit(form);

  await waitFor(() => form);
};

const startInRoute = (routeName: string): void => {
  window.history.pushState({}, 'Test page', routeName);
};

describe('Signup Page', () => {
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

    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('should show name error if Validation fails', () => {
    const validationError = faker.word.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name', validationError);
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

  test('should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.word.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('should show valid name state if Validation succeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');
    Helper.testStatusForField(sut, 'name');
  });

  test('should show valid email state if Validation succeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'email');
    Helper.testStatusForField(sut, 'email');
  });

  test('should show valid password state if Validation succeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'password');
    Helper.testStatusForField(sut, 'password');
  });

  test('should show valid passwordConfirmation state if Validation succeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'passwordConfirmation');
    Helper.testStatusForField(sut, 'passwordConfirmation');
  });

  test('should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');
    Helper.populateField(sut, 'email');
    Helper.populateField(sut, 'password');
    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testButtonIsDisabled(sut, 'submit', false);
  });

  test('should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    Helper.testElementExists(sut, 'spinner');
  });

  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, name, email, password);

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test('should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.word.words();
    const { sut, addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);

    await simulateValidSubmit(sut);

    Helper.testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });

  test('should call SaveAccessToken on success', async () => {
    const { sut, addAccountSpy, setCurrentAccountMock } = makeSut();

    startInRoute('/signup');

    await simulateValidSubmit(sut);

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(window.location.pathname).toBe('/');
  });

  test('should go to signup page', () => {
    const { sut } = makeSut();

    startInRoute('/login');

    const loginLink = sut.getByTestId('login-link');
    fireEvent.click(loginLink);

    expect(window.location.pathname).toBe('/login');
  });
});

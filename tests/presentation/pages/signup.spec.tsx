import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import {
  AddAccountSpy,
  Helper,
  UtilsHelper,
  ValidationStub,
} from '@/tests/presentation/mocks';
import { AccountModel } from '@/domain/models';
import { EmailInUseError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { Signup } from '@/presentation/pages';

type SutTypes = {
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

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <BrowserRouter>
        <Signup validation={validationStub} addAccount={addAccountSpy} />
      </BrowserRouter>
    </ApiContext.Provider>,
  );

  return { addAccountSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  name = faker.person.firstName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
): Promise<void> => {
  Helper.populateField('name', name);
  Helper.populateField('email', email);
  Helper.populateField('password', password);
  Helper.populateField('passwordConfirmation', password);

  const form = screen.getByTestId('form');
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe('Signup Page', () => {
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

    Helper.testStatusForField('name', validationError);
    Helper.testStatusForField('email', validationError);
    Helper.testStatusForField('password', validationError);
    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('should show name error if Validation fails', () => {
    const validationError = faker.word.words();
    makeSut({ validationError });

    Helper.populateField('name');

    Helper.testStatusForField('name', validationError);
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

  test('should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.word.words();
    makeSut({ validationError });

    Helper.populateField('passwordConfirmation');

    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('should show valid name state if Validation succeds', () => {
    makeSut();

    Helper.populateField('name');
    Helper.testStatusForField('name');
  });

  test('should show valid email state if Validation succeds', () => {
    makeSut();

    Helper.populateField('email');
    Helper.testStatusForField('email');
  });

  test('should show valid password state if Validation succeds', () => {
    makeSut();

    Helper.populateField('password');
    Helper.testStatusForField('password');
  });

  test('should show valid passwordConfirmation state if Validation succeds', () => {
    makeSut();

    Helper.populateField('passwordConfirmation');
    Helper.testStatusForField('passwordConfirmation');
  });

  test('should enable submit button if form is valid', () => {
    makeSut();

    Helper.populateField('name');
    Helper.populateField('email');
    Helper.populateField('password');
    Helper.populateField('passwordConfirmation');

    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  test('should show spinner on submit', async () => {
    makeSut();

    await simulateValidSubmit();

    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  test('should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut();
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(name, email, password);

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut();

    await simulateValidSubmit();
    await simulateValidSubmit();

    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.word.words();
    const { addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit();

    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);

    await simulateValidSubmit();

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1);
  });

  test('should call SaveAccessToken on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut();

    UtilsHelper.startInRoute('/signup');

    await simulateValidSubmit();

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(window.location.pathname).toBe('/');
  });

  test('should go to signup page', () => {
    makeSut();

    UtilsHelper.startInRoute('/login');

    const loginLink = screen.getByTestId('login-link');
    fireEvent.click(loginLink);

    expect(window.location.pathname).toBe('/login');
  });
});

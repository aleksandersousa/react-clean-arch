import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RenderResult, cleanup, fireEvent, render } from '@testing-library/react';
import {
  AuthenticationSpy,
  Helper,
  SaveAccessTokenMock,
  ValidationStub,
} from '@/presentation/test';
import { faker } from '@faker-js/faker';
import Signup from './Signup';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const populateField = (
  sut: RenderResult,
  fieldName: string,
  value = faker.random.word()
): void => {
  const input = sut.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <BrowserRouter>
      <Signup validation={validationStub} />
    </BrowserRouter>
  );

  return { sut, authenticationSpy, saveAccessTokenMock };
};

describe('Signup Page', () => {
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

    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('should show name error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name', validationError);
  });
});

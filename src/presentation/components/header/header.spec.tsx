import { ApiContext } from '@/presentation/contexts';
import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '@/presentation/components';
import { BrowserRouter } from 'react-router-dom';
import { UtilsHelper } from '@/presentation/test';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';

type SutTypes = {
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  UtilsHelper.startInRoute('/');

  const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => account,
      }}
    >
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </ApiContext.Provider>
  );

  return { setCurrentAccountMock };
};

describe('Header Component', () => {
  test('should call setCurrentAccount with null', () => {
    const { setCurrentAccountMock } = makeSut();
    fireEvent.click(screen.getByTestId('logout'));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(window.location.pathname).toBe('/login');
  });

  test('should render username correctly', () => {
    const account = mockAccountModel();
    makeSut(account);

    expect(screen.getByTestId('username')).toHaveTextContent(account.name);
  });
});

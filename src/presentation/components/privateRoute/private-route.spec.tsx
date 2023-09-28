import { render } from '@testing-library/react';
import { UtilsHelper } from '@/presentation/test';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ApiContext from '@/presentation/contexts/api/api-context';
import { mockAccountModel } from '@/domain/test';
import PrivateRoute from './PrivateRoute';

const makeSut = (account = mockAccountModel()): void => {
  UtilsHelper.startInRoute('/');

  render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<div />} />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<div />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>,
  );
};

describe('PrivateRoute', () => {
  test('should redirect to /login if token is empty', () => {
    makeSut(null);
    expect(window.location.pathname).toBe('/login');
  });

  test('should render current component if token is not empty', () => {
    makeSut();
    expect(window.location.pathname).toBe('/');
  });
});

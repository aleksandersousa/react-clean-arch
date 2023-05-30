import React from 'react';
import { render } from '@testing-library/react';
import { UtilsHelper } from '@/presentation/test';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const makeSut = (): void => {
  UtilsHelper.startInRoute('/');

  render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

describe('PrivateRoute', () => {
  test('should redirect to /login if token is empty', () => {
    makeSut();
    expect(window.location.pathname).toBe('/login');
  });
});

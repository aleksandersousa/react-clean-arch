import React from 'react';
import { render } from '@testing-library/react';
import Login from './Login';

describe('Login Page', () => {
  test('should not render Spinner and error on start', () => {
    const { getByTestId } = render(<Login />);

    const errorWrap = getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(0);
  });
});

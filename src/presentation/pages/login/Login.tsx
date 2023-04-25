/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react';
import {
  Footer, FormStatus, Input, PublicHeader,
} from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication } from '@/domain/usecases';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setState(prev => ({ ...prev, isLoading: true }));

    await authentication.auth({ email: state.email, password: state.password });
  };

  useEffect(() => {
    setState(prev => ({
      ...prev,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
    }));
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <PublicHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className={Styles.inputWrap}>
            <Input type="email" name="email" placeholder="Digite seu e-mail" />
            <Input type="password" name="password" placeholder="Digite sua senha" />
          </div>

          <button
            type="submit"
            data-testid="submit"
            className={Styles.submit}
            disabled={!!state.emailError || !!state.passwordError}
          >
            Entrar
          </button>

          <span className={Styles.link}>Criar conta</span>

          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Login;

/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useEffect, useState } from 'react';
import {
  Footer, FormStatus, Input, PublicHeader,
} from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
};

const Login: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    mainError: '',
  });

  useEffect(() => {
    validation.validate({ email: state.email });
  }, [state.email]);
  useEffect(() => {
    validation.validate({ password: state.password });
  }, [state.password]);

  return (
    <div className={Styles.login}>
      <PublicHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <div className={Styles.inputWrap}>
            <Input type="email" name="email" placeholder="Digite seu e-mail" />
            <Input type="password" name="password" placeholder="Digite sua senha" />
          </div>

          <button disabled data-testid="submit" className={Styles.submit} type="submit">
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

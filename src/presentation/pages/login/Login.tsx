/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState } from 'react';
import {
  Footer, FormStatus, Input, PublicHeader,
} from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false,
  });

  const [errorState] = useState({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: '',
  });

  return (
    <div className={Styles.login}>
      <PublicHeader />

      <FormContext.Provider value={{ state, errorState }}>
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

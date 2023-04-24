import React from 'react';
import {
  Footer, FormStatus, Input, PublicHeader,
} from '@/presentation/components';
import Styles from './styles.scss';

const Login: React.FC = () => (
  <div className={Styles.login}>
    <PublicHeader />

    <form className={Styles.form}>
      <h2>Login</h2>

      <div className={Styles.inputWrap}>
        <Input type="email" name="email" placeholder="Digite seu e-mail" />
        <Input type="password" name="password" placeholder="Digite sua senha" />
      </div>

      <button className={Styles.submit} type="submit">
        Entrar
      </button>

      <span className={Styles.link}>Criar conta</span>

      <FormStatus />
    </form>

    <Footer />
  </div>
);

export default Login;

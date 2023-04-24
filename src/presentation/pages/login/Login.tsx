import React from 'react';
import { Logo, Spinner } from '@/presentation/components';
import Styles from './styles.scss';

const Login: React.FC = () => (
  <div className={Styles.login}>
    <header className={Styles.header}>
      <Logo />
      <h1>4Devs - Enquetes para Programadores</h1>
    </header>

    <form className={Styles.form}>
      <h2>Login</h2>

      <div className={Styles.inputWrap}>
        <input type="email" name="email" placeholder="Digite seu e-mail" />
        <input type="password" name="password" placeholder="Digite sua senha" />
      </div>

      <button className={Styles.submit} type="submit">
        Entrar
      </button>

      <span className={Styles.link}>Criar conta</span>

      <div className={Styles.errorWrap}>
        <Spinner />
        <span className={Styles.error}>Erro</span>
      </div>
    </form>

    <footer className={Styles.footer} />
  </div>
);

export default Login;

/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';
import { Footer, FormStatus, Input, PublicHeader } from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Link } from 'react-router-dom';
import Styles from './styles.scss';

const Signup: React.FC = () => (
  <div className={Styles.signup}>
    <PublicHeader />

    <FormContext.Provider value={{ state: {} }}>
      <form className={Styles.form}>
        <h2>Criar Conta</h2>

        <div className={Styles.inputWrap}>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />
        </div>

        <button type="submit" data-testid="submit" className={Styles.submit}>
          Criar
        </button>

        <Link to="/login" className={Styles.link}>
          Voltar para Login
        </Link>

        <FormStatus />
      </form>
    </FormContext.Provider>

    <Footer />
  </div>
);

export default Signup;

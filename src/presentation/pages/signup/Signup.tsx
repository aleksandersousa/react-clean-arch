import React, { useEffect, useState } from 'react';
import { Footer, FormStatus, Input, PublicHeader } from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Link } from 'react-router-dom';
import { Validation } from '@/presentation/protocols/validation';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
};

const Signup: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: 'Campo obrigatorio',
    emailError: 'Campo obrigatorio',
    passwordError: 'Campo obrigatorio',
    passwordConfirmationError: 'Campo obrigatorio',
    mainError: '',
  });

  useEffect(() => {
    setState(prev => ({
      ...prev,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        state.passwordConfirmation
      ),
    }));
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  return (
    <div className={Styles.signup}>
      <PublicHeader />

      <FormContext.Provider value={{ state, setState }}>
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

          <button type="submit" data-testid="submit" className={Styles.submit} disabled>
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
};

export default Signup;
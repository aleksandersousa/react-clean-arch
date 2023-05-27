import React, { useEffect, useState } from 'react';
import {
  Footer,
  FormStatus,
  Input,
  PublicHeader,
  SubmitButton,
} from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication, UpdateCurrentAccount } from '@/domain/usecases';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
  updateCurrentAccount: UpdateCurrentAccount;
};

const Login: React.FC<Props> = ({ validation, authentication, updateCurrentAccount }) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });

      await updateCurrentAccount.save(account);

      navigate('/');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, mainError: error.message }));
    }
  };

  useEffect(() => {
    const { email, password } = state;
    const formData = { email, password };
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);

    setState(prev => ({
      ...prev,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError,
    }));
  }, [state.email, state.password]);

  return (
    <div className={Styles.loginWrap}>
      <PublicHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className={Styles.inputWrap}>
            <Input type="email" name="email" placeholder="Digite seu e-mail" />
            <Input type="password" name="password" placeholder="Digite sua senha" />
          </div>

          <SubmitButton text="Entrar" />

          <Link data-testid="signup-link" to="/signup" className={Styles.link}>
            Criar conta
          </Link>

          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { Footer, FormStatus, Input, PublicHeader } from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication, SaveAccessToken } from '@/domain/usecases';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }) => {
  const navigate = useNavigate();

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

    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });

      await saveAccessToken.save(account.accessToken);

      navigate('/');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, mainError: error.message }));
    }
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
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
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

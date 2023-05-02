import React, { useEffect, useState } from 'react';
import { Footer, FormStatus, Input, PublicHeader } from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Link, useNavigate } from 'react-router-dom';
import { Validation } from '@/presentation/protocols/validation';
import { AddAccount, SaveAccessToken } from '@/domain/usecases';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  saveAccessToken: SaveAccessToken;
};

const Signup: React.FC<Props> = ({ validation, addAccount, saveAccessToken }) => {
  const navigate = useNavigate();

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

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      if (
        state.isLoading ||
        state.nameError ||
        state.emailError ||
        state.passwordError ||
        state.passwordConfirmationError
      ) {
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });

      await saveAccessToken.save(account.accessToken);

      navigate('/');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, mainError: error.message }));
    }
  };

  return (
    <div className={Styles.signup}>
      <PublicHeader />

      <FormContext.Provider value={{ state, setState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
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

          <button
            type="submit"
            data-testid="submit"
            className={Styles.submit}
            disabled={
              !!state.nameError ||
              !!state.emailError ||
              !!state.passwordError ||
              !!state.passwordConfirmationError
            }
          >
            Criar
          </button>

          <Link replace data-testid="login-link" to="/login" className={Styles.link}>
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

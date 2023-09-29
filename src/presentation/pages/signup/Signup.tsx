import React, { useContext, useEffect, useState } from 'react';
import {
  Footer,
  FormStatus,
  Input,
  PublicHeader,
  SubmitButton,
} from '@/presentation/components';
import { ApiContext, FormContext } from '@/presentation/contexts';
import { Link, useNavigate } from 'react-router-dom';
import { Validation } from '@/presentation/protocols';
import { AddAccount } from '@/domain/usecases';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
};

const Signup: React.FC<Props> = ({ validation, addAccount }) => {
  const { setCurrentAccount } = useContext(ApiContext);
  const navigate = useNavigate();

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: false,
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
    validate('name');
  }, [state.name]);
  useEffect(() => {
    validate('email');
  }, [state.email]);
  useEffect(() => {
    validate('password');
  }, [state.password]);
  useEffect(() => {
    validate('passwordConfirmation');
  }, [state.passwordConfirmation]);

  const validate = (field: string): void => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };

    setState(prev => ({
      ...prev,
      [`${field}Error`]: validation.validate(field, formData),
    }));
    setState(prev => ({
      ...prev,
      isFormInvalid:
        !!prev.nameError ||
        !!prev.emailError ||
        !!prev.passwordError ||
        !!prev.passwordConfirmationError,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });

      setCurrentAccount(account);

      navigate('/');
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, mainError: error.message }));
    }
  };

  return (
    <div className={Styles.signupWrap}>
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

          <SubmitButton text="Criar" />

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

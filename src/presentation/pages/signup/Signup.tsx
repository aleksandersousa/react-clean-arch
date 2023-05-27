import React, { useEffect, useState } from 'react';
import {
  Footer,
  FormStatus,
  Input,
  PublicHeader,
  SubmitButton,
} from '@/presentation/components';
import FormContext from '@/presentation/contexts/form/form-context';
import { Link, useNavigate } from 'react-router-dom';
import { Validation } from '@/presentation/protocols/validation';
import { AddAccount, UpdateCurrentAccount } from '@/domain/usecases';
import Styles from './styles.scss';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  updateCurrentAccount: UpdateCurrentAccount;
};

const Signup: React.FC<Props> = ({ validation, addAccount, updateCurrentAccount }) => {
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
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };

    const nameError = validation.validate('name', formData);
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);
    const passwordConfirmationError = validation.validate(
      'passwordConfirmation',
      formData
    );

    setState(prev => ({
      ...prev,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid:
        !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError,
    }));
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

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

      await updateCurrentAccount.save(account);

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

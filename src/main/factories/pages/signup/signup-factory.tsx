import React from 'react';
import { Signup } from '@/presentation/pages';
import { makeSignupValidation } from './signup-validation-factory';
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory';

export const makeSignup: React.FC = () => (
  <Signup addAccount={makeRemoteAddAccount()} validation={makeSignupValidation()} />
);

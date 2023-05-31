import React from 'react';
import { Signup } from '@/presentation/pages';
import { makeRemoteAddAccount } from '@/main/factories/usecases';
import { makeSignupValidation } from './signup-validation-factory';

export const MakeSignup: React.FC = () => (
  <Signup addAccount={makeRemoteAddAccount()} validation={makeSignupValidation()} />
);

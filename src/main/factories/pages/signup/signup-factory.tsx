import React from 'react';
import { Signup } from '@/presentation/pages';
import { makeLocalUpdateCurrentAccount } from '@/main/factories/usecases/update-current-account/local-update-current-account-factory';
import { makeSignupValidation } from './signup-validation-factory';
import { makeRemoteAddAccount } from '../../usecases/add-account/remote-add-account-factory';

export const makeSignup: React.FC = () => (
  <Signup
    addAccount={makeRemoteAddAccount()}
    validation={makeSignupValidation()}
    updateCurrentAccount={makeLocalUpdateCurrentAccount()}
  />
);

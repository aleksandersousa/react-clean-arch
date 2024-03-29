import { Login } from '@/presentation/pages';
import { makeRemoteAuthentication } from '@/main/factories/usecases';
import { makeLoginValidation } from './login-validation-factory';

export const MakeLogin: React.FC = () => (
  <Login authentication={makeRemoteAuthentication()} validation={makeLoginValidation()} />
);

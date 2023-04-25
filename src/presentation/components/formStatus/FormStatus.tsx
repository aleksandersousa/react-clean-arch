import React, { useContext } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';
import Spinner from '../spinner/Spinner';

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(formContext);

  return (
    <div data-testid="error-wrap" className={Styles.formStatus}>
      {state.isLoading && <Spinner />}
      {errorState.main && <span className={Styles.error}>{errorState.main}</span>}
    </div>
  );
};

export default FormStatus;

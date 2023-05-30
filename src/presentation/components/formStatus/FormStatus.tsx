import React, { useContext } from 'react';
import { FormContext } from '@/presentation/contexts';
import Styles from './styles.scss';
import Spinner from '../spinner/Spinner';

const FormStatus: React.FC = () => {
  const { state } = useContext(FormContext);

  return (
    <div data-testid="error-wrap" className={Styles.formStatus}>
      {state.isLoading && <Spinner />}
      {state.mainError && (
        <span data-testid="main-error" className={Styles.error}>
          {state.mainError}
        </span>
      )}
    </div>
  );
};

export default FormStatus;

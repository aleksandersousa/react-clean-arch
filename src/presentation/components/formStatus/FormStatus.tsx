import React, { useContext } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';
import Spinner from '../spinner/Spinner';

const FormStatus: React.FC = () => {
  const { state } = useContext(formContext);

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

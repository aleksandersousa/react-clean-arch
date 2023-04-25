import React, { useContext } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';
import Spinner from '../spinner/Spinner';

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(formContext);

  return (
    <div data-testid="error-wrap" className={Styles.formStatus}>
      {isLoading && <Spinner />}
      {errorMessage && <span className={Styles.error}>{errorMessage}</span>}
    </div>
  );
};

export default FormStatus;

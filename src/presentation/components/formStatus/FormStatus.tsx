import React from 'react';
import Styles from './styles.scss';
import Spinner from '../spinner/Spinner';

const FormStatus: React.FC = () => (
  <div className={Styles.formStatus}>
    <Spinner />
    <span className={Styles.error}>Erro</span>
  </div>
);

export default FormStatus;

import React, { useContext } from 'react';
import { FormContext } from '@/presentation/contexts';
import Styles from './styles.scss';

type Props = {
  text: string;
};

const SubmitButton: React.FC<Props> = ({ text }) => {
  const { state } = useContext(FormContext);

  return (
    <button
      type="submit"
      data-testid="submit"
      className={Styles.submit}
      disabled={state.isFormInvalid}
    >
      {text}
    </button>
  );
};

export default SubmitButton;

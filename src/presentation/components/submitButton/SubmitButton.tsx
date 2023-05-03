import React, { useContext } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';

type Props = {
  text: string;
};

const SubmitButton: React.FC<Props> = ({ text }) => {
  const { state } = useContext(formContext);

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

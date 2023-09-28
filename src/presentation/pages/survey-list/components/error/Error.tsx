import React, { useContext } from 'react';
import { State } from '@/presentation/pages/survey-list/SurveyList';
import { SurveyContext } from '@/presentation/pages/survey-list/components';
import Styles from './styles.scss';

const Error: React.FC = () => {
  const { state, setState } = useContext(SurveyContext);

  const reload = (): void => {
    setState((prev: State) => ({ surveys: [], error: '', reload: !prev.reload }));
  };

  return (
    <div className={Styles.errorWrap}>
      <span data-testid="error">{state.error}</span>
      <button data-testid="reload" type="button" onClick={reload}>
        Tentar novamente
      </button>
    </div>
  );
};

export default Error;

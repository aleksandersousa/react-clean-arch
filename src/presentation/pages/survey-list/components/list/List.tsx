import React, { useContext } from 'react';
import { SurveyModel } from '@/domain/models';
import { SurveyContext, SurveyItem, SurveyItemEmpty } from '..';
import Styles from './styles.scss';

const List: React.FC = () => {
  const { state } = useContext(SurveyContext);

  return (
    <ul className={Styles.listWrap} data-testid="survey-list">
      {state.surveys.length ? (
        state.surveys.map((s: SurveyModel) => <SurveyItem key={s.id} survey={s} />)
      ) : (
        <SurveyItemEmpty />
      )}
    </ul>
  );
};

export default List;

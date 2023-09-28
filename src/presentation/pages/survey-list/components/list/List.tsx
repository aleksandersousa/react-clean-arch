import React from 'react';
import { SurveyModel } from '@/domain/models';
import { SurveyItem, SurveyItemEmpty } from '..';
import Styles from './styles.scss';

type Props = {
  surveys: SurveyModel[];
};

const List: React.FC<Props> = ({ surveys }) => (
  <ul className={Styles.listWrap} data-testid="survey-list">
    {surveys.length ? (
      surveys.map(s => <SurveyItem key={s.id} survey={s} />)
    ) : (
      <SurveyItemEmpty />
    )}
  </ul>
);

export default List;

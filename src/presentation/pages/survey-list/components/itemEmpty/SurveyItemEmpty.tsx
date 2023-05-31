import React from 'react';
import Styles from './styles.scss';

const SurveyItemEmpty: React.FC = () => (
  <>
    <li className={Styles.surveyItemEmpty} />
    <li />
    <li />
    <li />
  </>
);

export default SurveyItemEmpty;

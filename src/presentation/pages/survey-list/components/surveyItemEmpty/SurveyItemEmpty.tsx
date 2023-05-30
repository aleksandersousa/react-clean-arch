import React from 'react';
import Styles from './styles.scss';

const SurveyItemEmpty: React.FC = () => {
  const x = 0;
  return (
    <>
      <li className={Styles.surveyItemEmpty} />
      <li />
      <li />
      <li />
    </>
  );
};

export default SurveyItemEmpty;

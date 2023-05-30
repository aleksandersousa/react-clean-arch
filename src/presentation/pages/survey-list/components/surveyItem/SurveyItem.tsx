import React from 'react';
import { Icon, IconName } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyItem: React.FC = () => {
  const x = 0;
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName={IconName.thumbDown} />

        <time>
          <span className={Styles.day}>22</span>
          <span className={Styles.month}>03</span>
          <span className={Styles.year}>2023</span>
        </time>

        <p>Qual eh seu framwork web favorito?</p>
      </div>

      <footer>Ver Resultado</footer>
    </li>
  );
};

export default SurveyItem;

import React from 'react';
import { Footer, Header, Icon, IconName } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquete</h2>

      <ul>
        <li>
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
        <li />
      </ul>
    </div>

    <Footer />
  </div>
);

export default SurveyList;

import React from 'react';
import { Footer, Header } from '@/presentation/components';
import Styles from './styles.scss';
import { SurveyItemEmpty } from './components';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>

      <ul data-testid="survey-list">
        <SurveyItemEmpty />
      </ul>
    </div>

    <Footer />
  </div>
);

export default SurveyList;

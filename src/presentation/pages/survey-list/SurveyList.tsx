import React from 'react';
import { Footer, Header } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <Header />

    <div className={Styles.contentWrap}>
      <h2>Enquete</h2>

      <ul>
        <li />
      </ul>
    </div>

    <Footer />
  </div>
);

export default SurveyList;

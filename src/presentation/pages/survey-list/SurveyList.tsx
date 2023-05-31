import React, { useEffect, useState } from 'react';
import { Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { SurveyItem, SurveyItemEmpty } from './components';
import Styles from './styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [state, setState] = useState({ surveys: [] as SurveyModel[] });

  useEffect(() => {
    loadSurveyList.loadAll().then(surveys => setState({ surveys }));
  }, []);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        <ul data-testid="survey-list">
          {state.surveys.length ? (
            state.surveys.map(s => <SurveyItem key={s.id} survey={s} />)
          ) : (
            <SurveyItemEmpty />
          )}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default SurveyList;

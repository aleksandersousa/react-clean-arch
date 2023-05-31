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
  const [state, setState] = useState({ surveys: [] as SurveyModel[], error: '' });

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then(surveys => setState(prev => ({ ...prev, surveys })))
      .catch(error => setState(prev => ({ ...prev, error: error.message })));
  }, []);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div data-testid="content-wrap" className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        {state.error ? (
          <div>
            <span data-testid="error">{state.error}</span>
            <button type="button">Recarregar</button>
          </div>
        ) : (
          <ul data-testid="survey-list">
            {state.surveys.length ? (
              state.surveys.map(s => <SurveyItem key={s.id} survey={s} />)
            ) : (
              <SurveyItemEmpty />
            )}
          </ul>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SurveyList;

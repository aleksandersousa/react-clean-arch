import React, { useEffect, useState } from 'react';
import { Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { Error, List, SurveyContext } from './components';
import Styles from './styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

export type State = {
  surveys: SurveyModel[];
  error: string;
  reload: boolean;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [state, setState] = useState<State>({
    surveys: [] as SurveyModel[],
    error: '',
    reload: false,
  });

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then(surveys => setState(prev => ({ ...prev, surveys })))
      .catch(error => setState(prev => ({ ...prev, error: error.message })));
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div data-testid="content-wrap" className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error /> : <List />}
        </SurveyContext.Provider>
      </div>

      <Footer />
    </div>
  );
};

export default SurveyList;

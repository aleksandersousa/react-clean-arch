import React, { useEffect, useState } from 'react';
import { Error, Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { useErrorHandler } from '@/presentation/hooks';
import { List, SurveyContext } from './components';
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

  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, error: error.message }));
  });

  const reload = (): void => {
    setState((prev: State) => ({ surveys: [], error: '', reload: !prev.reload }));
  };

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then(surveys => setState(prev => ({ ...prev, surveys })))
      .catch(handleError);
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />

      <div data-testid="content-wrap" className={Styles.contentWrap}>
        <h2>Enquetes</h2>

        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error error={state.error} reload={reload} /> : <List />}
        </SurveyContext.Provider>
      </div>

      <Footer />
    </div>
  );
};

export default SurveyList;

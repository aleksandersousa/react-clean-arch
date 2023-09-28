import { useEffect, useState } from 'react';
import { Error, Footer, Header, Loading } from '@/presentation/components';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import Styles from './styles.scss';
import { SurveyResultData } from './components';

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

export type State = {
  surveyResult: SurveyResultModel;
  error: string;
  isLoading: boolean;
  reload: boolean;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    reload: false,
    error: '',
    surveyResult: null as SurveyResultModel,
  });

  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({ ...prev, surveyResult: null, error: error.message }));
  });

  useEffect(() => {
    loadSurveyResult
      .load()
      .then(surveyResult => setState(prev => ({ ...prev, surveyResult })))
      .catch(handleError);
  }, [state.reload]);

  const reload = (): void => {
    setState((prev: State) => ({
      surveyResult: null,
      error: '',
      isLoading: false,
      reload: !prev.reload,
    }));
  };

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={reload} />}
        {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
      </div>

      <Footer />
    </div>
  );
};

export default SurveyResult;

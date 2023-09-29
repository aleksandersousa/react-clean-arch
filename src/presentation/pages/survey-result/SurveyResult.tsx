import { useEffect, useState } from 'react';
import { Error, Footer, Header, Loading } from '@/presentation/components';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import Styles from './styles.scss';
import { SurveyResultContext, SurveyResultData } from './components';

type Props = {
  loadSurveyResult: LoadSurveyResult;
  saveSurveyResult: SaveSurveyResult;
};

export type State = {
  surveyResult: SurveyResultModel;
  error: string;
  isLoading: boolean;
  reload: boolean;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }) => {
  const [state, setState] = useState<State>({
    isLoading: false,
    reload: false,
    error: '',
    surveyResult: null as SurveyResultModel,
  });

  const handleError = useErrorHandler((error: Error) => {
    setState(prev => ({
      ...prev,
      surveyResult: null,
      isLoading: false,
      error: error.message,
    }));
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

  const onAnswer = (answer: string): void => {
    setState(prev => ({ ...prev, isLoading: true }));

    saveSurveyResult
      .save({ answer })
      .then(surveyResult => {
        setState(prev => ({ ...prev, isLoading: false, surveyResult }));
      })
      .catch(handleError);
  };

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div data-testid="survey-result" className={Styles.contentWrap}>
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={reload} />}
          {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
        </div>
      </SurveyResultContext.Provider>

      <Footer />
    </div>
  );
};

export default SurveyResult;

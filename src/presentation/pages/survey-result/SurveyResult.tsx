import FlipMove from 'react-flip-move';
import { useEffect, useState } from 'react';
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import Styles from './styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

export type State = {
  surveyResult: SurveyResultModel;
  error: string;
  isLoading;
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
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar
                date={state.surveyResult.date as Date}
                className={Styles.calendarWrap}
              />

              <h2 data-testid="question">{state.surveyResult.question}</h2>
            </hgroup>

            <FlipMove data-testid="answers" className={Styles.answersList}>
              {state.surveyResult.answers.map(answer => {
                const className = answer.isCurrentAccountAnswer ? Styles.active : '';

                return (
                  <li data-testid="answer-wrap" key={answer.answer} className={className}>
                    {answer.image && (
                      <img data-testid="image" src={answer.image} alt={answer.answer} />
                    )}

                    <span data-testid="answer" className={Styles.answer}>
                      {answer.answer}
                    </span>
                    <span data-testid="percent" className={Styles.percent}>
                      {answer.percent}%
                    </span>
                  </li>
                );
              })}
            </FlipMove>

            <button type="button">Voltar</button>
          </>
        )}

        {state.isLoading && <Loading />}

        {state.error && <Error error={state.error} reload={reload} />}
      </div>

      <Footer />
    </div>
  );
};

export default SurveyResult;

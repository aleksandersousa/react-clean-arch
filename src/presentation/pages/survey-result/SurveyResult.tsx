import FlipMove from 'react-flip-move';
import { useEffect, useState } from 'react';
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components';
import { SurveyModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases';
import Styles from './styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }) => {
  const [state] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as SurveyModel,
  });

  useEffect(() => {
    loadSurveyResult.load().then().catch();
  }, []);

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />

      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={new Date()} className={Styles.calendarWrap} />

              <h2>Qual é seu framework web favorito?</h2>
            </hgroup>

            <FlipMove className={Styles.answersList}>
              <li>
                <img src="" alt="" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li className={Styles.active}>
                <img src="" alt="" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
              <li>
                <img src="" alt="" />
                <span className={Styles.answer}>ReactJS</span>
                <span className={Styles.percent}>50%</span>
              </li>
            </FlipMove>

            <button type="button">Voltar</button>
          </>
        )}

        {state.isLoading && <Loading />}
        {state.error && (
          <Error
            error={state.error}
            reload={(): void => {
              console.log('error');
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SurveyResult;

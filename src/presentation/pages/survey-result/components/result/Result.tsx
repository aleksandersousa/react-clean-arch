import { useNavigate } from 'react-router-dom';
import FlipMove from 'react-flip-move';
import { SurveyResultModel } from '@/domain/models';
import { Calendar } from '@/presentation/components';
import { SurveyResultAnswer } from '@/presentation/pages/survey-result/components';
import Styles from './styles.scss';

type Props = {
  surveyResult: SurveyResultModel;
};

const Result: React.FC<Props> = ({ surveyResult }) => {
  const navigate = useNavigate();

  const goBack = (): void => navigate('/');

  return (
    <div className={Styles.contentWrap}>
      <hgroup>
        <Calendar date={surveyResult.date as Date} className={Styles.calendarWrap} />

        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>

      <FlipMove data-testid="answers" className={Styles.answersList}>
        <>
          {surveyResult.answers.map(answer => (
            <SurveyResultAnswer key={answer.answer} answer={answer} />
          ))}
        </>
      </FlipMove>

      <button data-testid="back-button" type="button" onClick={goBack}>
        Voltar
      </button>
    </div>
  );
};

export default Result;

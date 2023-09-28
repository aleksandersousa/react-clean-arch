import FlipMove from 'react-flip-move';
import { SurveyResultModel } from '@/domain/models';
import { Calendar } from '@/presentation/components';
import { useNavigate } from 'react-router-dom';
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
        {surveyResult.answers.map(answer => {
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

      <button data-testid="back-button" type="button" onClick={goBack}>
        Voltar
      </button>
    </div>
  );
};

export default Result;

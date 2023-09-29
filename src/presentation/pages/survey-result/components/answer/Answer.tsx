import React, { useContext } from 'react';
import { SurveyResultAnswer } from '@/domain/models';
import { SurveyResultContext } from '@/presentation/pages/survey-result/components';
import Styles from './styles.scss';

type Props = {
  answer: SurveyResultAnswer;
};

const Answer: React.FC<Props> = ({ answer }) => {
  const { onAnswer } = useContext(SurveyResultContext);
  const activeClassName = answer.isCurrentAccountAnswer ? Styles.active : '';

  const answerClick = (event: React.MouseEvent): void => {
    if (event.currentTarget.classList.contains(Styles.active)) {
      return;
    }

    onAnswer(answer.answer);
  };

  return (
    <li
      data-testid="answer-wrap"
      key={answer.answer}
      className={[Styles.answerWrap, activeClassName].join(' ')}
      onClick={answerClick}
    >
      {answer.image && <img data-testid="image" src={answer.image} alt={answer.answer} />}

      <span data-testid="answer" className={Styles.answer}>
        {answer.answer}
      </span>
      <span data-testid="percent" className={Styles.percent}>
        {answer.percent}%
      </span>
    </li>
  );
};

export default Answer;

import { Calendar, Icon, IconName } from '@/presentation/components';
import { SurveyModel } from '@/domain/models';
import Styles from './styles.scss';

type Props = {
  survey: SurveyModel;
};

const SurveyItem: React.FC<Props> = ({ survey }) => {
  const iconName = survey.didAnswer ? IconName.thumbUp : IconName.thumbDown;

  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName={iconName} />

        <Calendar date={survey.date as Date} className={Styles.calendarWrap} />

        <p data-testid="question">{survey.question}</p>
      </div>

      <footer>Ver Resultado</footer>
    </li>
  );
};

export default SurveyItem;

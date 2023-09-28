import FlipMove from 'react-flip-move';
import { Calendar, Footer, Header, Loading } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyResult: React.FC = () => (
  <div className={Styles.surveyResultWrap}>
    <Header />

    <div data-testid="content-wrap" className={Styles.contentWrap}>
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

      {false && <Loading />}
    </div>

    <Footer />
  </div>
);

export default SurveyResult;

import FlipMove from 'react-flip-move';
import { Footer, Header, Spinner } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyResult: React.FC = () => (
  <div className={Styles.surveyResultWrap}>
    <Header />

    <div data-testid="content-wrap" className={Styles.contentWrap}>
      <h2>Qual é seu framework web favorito?</h2>

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

      <div className={Styles.loadingWrap}>
        <div className={Styles.loading}>
          <span>Aguarde...</span>
          <Spinner isNegative />
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export default SurveyResult;

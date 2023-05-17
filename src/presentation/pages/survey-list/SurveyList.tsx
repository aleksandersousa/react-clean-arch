import React from 'react';
import { Footer, Logo } from '@/presentation/components';
import Styles from './styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />

        <div className={Styles.logoutWrap}>
          <span>Aleksander</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </header>

    <div className={Styles.contentWrap}>
      <h2>Enquete</h2>

      <ul>
        <li>
          <div className={Styles.surveyContent}>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>03</span>
              <span className={Styles.year}>2023</span>
            </time>

            <p>Qual eh seu framwork web favorito?</p>
          </div>

          <footer>Ver Resultado</footer>
        </li>
        <li>
          <div className={Styles.surveyContent}>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>03</span>
              <span className={Styles.year}>2023</span>
            </time>

            <p>Qual eh seu framwork web favorito?</p>
          </div>

          <footer>Ver Resultado</footer>
        </li>
        <li>
          <div className={Styles.surveyContent}>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>03</span>
              <span className={Styles.year}>2023</span>
            </time>

            <p>Qual eh seu framwork web favorito?</p>
          </div>

          <footer>Ver Resultado</footer>
        </li>
        <li>
          <div className={Styles.surveyContent}>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>03</span>
              <span className={Styles.year}>2023</span>
            </time>

            <p>Qual eh seu framwork web favorito?</p>
          </div>

          <footer>Ver Resultado</footer>
        </li>
        <li>
          <div className={Styles.surveyContent}>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>03</span>
              <span className={Styles.year}>2023</span>
            </time>

            <p>Qual eh seu framwork web favorito?</p>
          </div>

          <footer>Ver Resultado</footer>
        </li>
      </ul>
    </div>

    <Footer />
  </div>
);

export default SurveyList;

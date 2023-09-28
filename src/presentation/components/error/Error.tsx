import React from 'react';
import Styles from './styles.scss';

type Props = {
  error: string;
  reload: () => void;
};

const Error: React.FC<Props> = ({ error, reload }) => (
  <div className={Styles.errorWrap}>
    <span data-testid="error">{error}</span>
    <button data-testid="reload" type="button" onClick={reload}>
      Tentar novamente
    </button>
  </div>
);

export default Error;

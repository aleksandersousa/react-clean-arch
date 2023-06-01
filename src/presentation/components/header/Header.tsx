import React, { memo, useContext } from 'react';
import { Logo } from '@/presentation/components';
import { ApiContext } from '@/presentation/contexts';
import { useNavigate } from 'react-router-dom';
import Styles from './styles.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentAccount, getCurrentAccount } = useContext(ApiContext);

  const logout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();

    setCurrentAccount(undefined);

    navigate('/login');
  };

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />

        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);

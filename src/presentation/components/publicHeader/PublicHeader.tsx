import React, { memo } from 'react';
import Logo from '../logo/Logo';
import Styles from './styles.scss';

const PublicHeader: React.FC = () => (
  <header className={Styles.header}>
    <Logo />
    <h1>4Devs - Enquetes para Programadores</h1>
  </header>
);

export default memo(PublicHeader);

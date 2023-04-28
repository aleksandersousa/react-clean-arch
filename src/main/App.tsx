import React from 'react';
import Router from './Router';
import '@/presentation/styles/global.scss';
import { makeLogin } from './factories/pages/login/login-factory';

const App: React.FC = () => (
  <div>
    <Router MakeLogin={makeLogin} />
  </div>
);

export default App;

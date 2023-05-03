import React from 'react';
import Router from './Router';
import { makeLogin, makeSignup } from './factories/pages';
import '@/presentation/styles/global.scss';

const App: React.FC = () => (
  <div>
    <Router MakeLogin={makeLogin} MakeSignup={makeSignup} />
  </div>
);

export default App;

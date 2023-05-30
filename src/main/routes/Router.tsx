import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { makeLogin as MakeLogin, makeSignup as MakeSignup } from '@/main/factories/pages';
import { SurveyList } from '@/presentation/pages';
import { ApiContext } from '@/presentation/contexts';
import { setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';

const Router: React.FC = () => (
  <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountAdapter }}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<MakeSignup />} />
        <Route path="/" element={<SurveyList />} />
      </Routes>
    </BrowserRouter>
  </ApiContext.Provider>
);

export default Router;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { makeLogin as MakeLogin, makeSignup as MakeSignup } from '@/main/factories/pages';
import { SurveyList } from '@/presentation/pages';
import { ApiContext } from '@/presentation/contexts';
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter,
} from '@/main/adapters/current-account-adapter';
import { PrivateRoute } from '@/presentation/components';

const Router: React.FC = () => (
  <ApiContext.Provider
    value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter,
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
        <Route path="/signup" element={<MakeSignup />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<SurveyList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ApiContext.Provider>
);

export default Router;

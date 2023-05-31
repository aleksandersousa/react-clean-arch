import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MakeLogin, MakeSignup, MakeSurveyList } from '@/main/factories/pages';
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
          <Route path="/" element={<MakeSurveyList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ApiContext.Provider>
);

export default Router;

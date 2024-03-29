import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  MakeLogin,
  MakeSignup,
  MakeSurveyList,
  MakeSurveyResult,
} from '@/main/factories/pages';
import { ApiContext } from '@/presentation/contexts';
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters';
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
          <Route path="/surveys/:id" element={<MakeSurveyResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ApiContext.Provider>
);

export default Router;

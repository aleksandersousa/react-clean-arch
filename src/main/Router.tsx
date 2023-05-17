import React from 'react';
import { SurveyList } from '@/presentation/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

type Factory = {
  MakeLogin: React.FC;
  MakeSignup: React.FC;
};

const Router: React.FC<Factory> = ({ MakeLogin, MakeSignup }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<MakeLogin />} />
      <Route path="/signup" element={<MakeSignup />} />
      <Route path="/" element={<SurveyList />} />
    </Routes>
  </BrowserRouter>
);

export default Router;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { makeLogin as MakeLogin, makeSignup as MakeSignup } from '@/main/factories/pages';
import { SurveyList } from '@/presentation/pages';

const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<MakeLogin />} />
      <Route path="/signup" element={<MakeSignup />} />
      <Route path="/" element={<SurveyList />} />
    </Routes>
  </BrowserRouter>
);

export default Router;

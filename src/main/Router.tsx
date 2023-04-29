import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from '@/presentation/pages';

type Props = {
  MakeLogin: React.FC;
};

const Router: React.FC<Props> = ({ MakeLogin }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<MakeLogin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
);

export default Router;

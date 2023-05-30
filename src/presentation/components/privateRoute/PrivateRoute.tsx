import React from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

const PrivateRoute: React.FC<RouteProps> = () => {
  const auth = null;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

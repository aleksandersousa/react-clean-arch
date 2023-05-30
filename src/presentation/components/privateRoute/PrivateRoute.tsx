import { ApiContext } from '@/presentation/contexts';
import React, { useContext } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

const PrivateRoute: React.FC<RouteProps> = () => {
  const { getCurrentAccount } = useContext(ApiContext);
  const auth = getCurrentAccount()?.accessToken;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

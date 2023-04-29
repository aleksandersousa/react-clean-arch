import RemoteAuthentication from '@/data/usecases/authentication/remote-authentication';
import { makeAxiosHttpClient } from '@/main/factories/htpp/axios-http-client-factory';
import { makeApiUrl } from '@/main/factories/htpp/api-url-factory';

export const makeRemoteAuthentication = () => {
  const remoteAuthentication = new RemoteAuthentication(
    makeApiUrl('/login'),
    makeAxiosHttpClient()
  );
  return remoteAuthentication;
};

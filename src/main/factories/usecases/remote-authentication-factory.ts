import { RemoteAuthentication } from '@/data/usecases';
import { makeAxiosHttpClient, makeApiUrl } from '@/main/factories/htpp';

export const makeRemoteAuthentication = () => {
  const remoteAuthentication = new RemoteAuthentication(
    makeApiUrl('/login'),
    makeAxiosHttpClient(),
  );
  return remoteAuthentication;
};

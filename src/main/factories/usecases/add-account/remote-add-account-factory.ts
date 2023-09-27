import { makeAxiosHttpClient, makeApiUrl } from '@/main/factories/htpp';
import { RemoteAddAccount } from '@/data/usecases';

export const makeRemoteAddAccount = () => {
  const remoteAddAccount = new RemoteAddAccount(
    makeApiUrl('/signup'),
    makeAxiosHttpClient()
  );
  return remoteAddAccount;
};

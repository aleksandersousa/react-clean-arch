import { makeAxiosHttpClient } from '@/main/factories/htpp/axios-http-client-factory';
import { makeApiUrl } from '@/main/factories/htpp/api-url-factory';
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account';

export const makeRemoteAddAccount = () => {
  const remoteAddAccount = new RemoteAddAccount(
    makeApiUrl('/signup'),
    makeAxiosHttpClient()
  );
  return remoteAddAccount;
};

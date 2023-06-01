import { HttpGetClient } from '@/data/protocols/http';
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '@/main/factories/cache';
import { makeAxiosHttpClient } from '@/main/factories/htpp';

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient => {
  const decorator = new AuthorizeHttpGetClientDecorator(
    makeLocalStorageAdapter(),
    makeAxiosHttpClient()
  );

  return decorator;
};

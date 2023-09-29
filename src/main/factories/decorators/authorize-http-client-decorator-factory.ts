import { HttpClient } from '@/data/protocols/http';
import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '@/main/factories/cache';
import { makeAxiosHttpClient } from '@/main/factories/htpp';

export const makeAuthorizeHttpClientDecorator = (): HttpClient => {
  const decorator = new AuthorizeHttpClientDecorator(
    makeLocalStorageAdapter(),
    makeAxiosHttpClient(),
  );

  return decorator;
};

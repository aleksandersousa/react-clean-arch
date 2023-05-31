import { GetStorage } from '@/data/protocols/cache';
import { HttpGetClient, HttpGetParams, HttpResponse } from '@/data/protocols/http';

export class AuthorizeHttpGetClientDecorator implements HttpGetClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpGetClient: HttpGetClient
  ) {}

  get = async (params: HttpGetParams): Promise<HttpResponse> => {
    this.getStorage.get('account');

    await this.httpGetClient.get(params);

    return null;
  };
}

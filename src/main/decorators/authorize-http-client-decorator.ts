import { GetStorage } from '@/data/protocols/cache';
import { HttpClient, HttpRequest, HttpResponse } from '@/data/protocols/http';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpGetClient: HttpClient,
  ) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const account = this.getStorage.get('account');

    if (account?.accessToken) {
      Object.assign(data, {
        headers: {
          ...data.headers,
          'x-access-token': account.accessToken,
        },
      });
    }

    const httpReponse = await this.httpGetClient.request(data);

    return httpReponse;
  }
}

import { faker } from '@faker-js/faker';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@/data/protocols/http';

export const mockRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  body: faker.word.verb(),
  headers: faker.word.verb(),
  method: faker.helpers.arrayElement(['post', 'get', 'put', 'delete']),
});

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string;
  method?: string;
  headers?: any;
  body?: any;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok,
  };

  async request(params: HttpRequest): Promise<HttpResponse<R>> {
    this.url = params.url;
    this.method = params.method;
    this.headers = params.headers;
    this.body = params.body;

    return Promise.resolve(this.response);
  }
}

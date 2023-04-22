import { HttpPostClient } from '@/data/protocols/http/http-post-client';
import { AuthenticationParams } from '@/domain/usecases/authetication';

export default class RemoteAuthentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient,
  ) {
    console.log('TODO');
  }

  async auth(params: AuthenticationParams): Promise<void> {
    await this.httpPostClient.post({ url: this.url, body: params });
  }
}

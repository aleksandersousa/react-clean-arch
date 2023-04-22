import RemoteAuthentication from '../remote-authentication';
import HttpPostClientSpy from '../../test/mock-http-client';

describe('RemoteAuthentication', () => {
  test('should call HTTPPostClient with correct URL', async () => {
    const url = 'url';
    const httpPostClientSpy = new HttpPostClientSpy();
    const sut = new RemoteAuthentication(url, httpPostClientSpy);

    await sut.auth();

    expect(httpPostClientSpy.url).toBe(url);
  });
});

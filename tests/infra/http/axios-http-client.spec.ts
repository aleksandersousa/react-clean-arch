import axios from 'axios';
import { mockAxios, mockHttpResponse } from '@/tests/infra/mocks';
import { mockRequest } from '@/tests/data/mocks';
import { AxiosHttpClient } from '@/infra/http';

jest.mock('axios');

type SutTypes = {
  sut: AxiosHttpClient;
  mockedAxios: jest.Mocked<typeof axios>;
};

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient();
  const mockedAxios = mockAxios();

  return { sut, mockedAxios };
};

describe('AxiosHttpClient', () => {
  test('Should call axios with correct values', async () => {
    const request = mockRequest();

    const { sut, mockedAxios } = makeSut();

    await sut.request(request);

    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      method: request.method,
      headers: request.headers,
      data: request.body,
    });
  });

  test('Should return correct response on axios', async () => {
    const { sut, mockedAxios } = makeSut();
    const httpResponse = await sut.request(mockRequest());
    const axiosResponse = await mockedAxios.request.mock.results[0].value;

    expect(httpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    });
  });

  test('Should return correct error on axios', () => {
    const { sut, mockedAxios } = makeSut();
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse(),
    });

    const promise = sut.request(mockRequest());
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
  });
});

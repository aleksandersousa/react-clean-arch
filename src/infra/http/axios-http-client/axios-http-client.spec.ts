import axios from 'axios';
import { faker } from '@faker-js/faker';
import { HttpPostParams } from '@/data/protocols/http';
import { AxiosHttpClient } from './axios-http-client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosResult = {
  status: faker.random.numeric(),
  data: faker.random.word(),
};
mockedAxios.post.mockResolvedValue(mockedAxiosResult);

const makeSut = (): AxiosHttpClient => new AxiosHttpClient();

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.word(),
});

describe('AxiosHttpClient', () => {
  test('should call axios with correct values', async () => {
    const request = mockPostRequest();
    const sut = makeSut();
    await sut.post(request);

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body);
  });

  test('should return correct status code and body', async () => {
    const sut = makeSut();
    const httpResponse = await sut.post(mockPostRequest());

    expect(httpResponse).toEqual({
      statusCode: mockedAxiosResult.status,
      body: mockedAxiosResult.data,
    });
  });
});

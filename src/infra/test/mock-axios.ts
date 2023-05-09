import { faker } from '@faker-js/faker';
import axios from 'axios';

export const mockHttpResponse = () => ({
  status: faker.random.numeric(3),
  data: faker.random.word(),
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  mockedAxios.post.mockClear().mockResolvedValue(mockHttpResponse());
  mockedAxios.get.mockClear().mockResolvedValue(mockHttpResponse());

  return mockedAxios;
};

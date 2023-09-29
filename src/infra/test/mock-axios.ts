import { faker } from '@faker-js/faker';
import axios from 'axios';

export const mockHttpResponse = () => ({
  status: faker.string.numeric(3),
  data: faker.word.verb(),
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse());

  return mockedAxios;
};

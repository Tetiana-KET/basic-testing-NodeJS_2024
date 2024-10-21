import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

jest.mock('lodash', () => ({
  throttle: (fn: () => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('/posts/1');
    expect(axios.create).toHaveBeenCalledWith({ baseURL: BASE_URL });
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: {} });
    axios.create = jest.fn().mockReturnValue({ get: mockedGet });
    await throttledGetDataFromApi('/posts/1');
    expect(mockedGet).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockedGet = jest.fn().mockResolvedValue({ data: { id: '1' } });
    axios.create = jest.fn().mockReturnValue({ get: mockedGet });
    const result = await throttledGetDataFromApi('/posts/1');
    expect(result).toEqual({ id: '1' });
  });
});

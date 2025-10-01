
import { Request } from '../models/Request';
import requests from '@/mock/requests.json';

export const setRequestMockData = async (): Promise<Request[]> => {

  const data = JSON.stringify(requests)

  localStorage.setItem('r-requests', data)

  return requests as unknown as Request[];
}
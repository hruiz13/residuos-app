import { User } from "../models/User";
import users from '@/mock/users.json';

export const setMockData = async (): Promise<User[]> => {

  const data = JSON.stringify(users)

  localStorage.setItem('r-users', data)

  return users as unknown as User[];
}
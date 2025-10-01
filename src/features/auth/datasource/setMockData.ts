import { User } from "../models/User";
import users from '@/mock/users.json';

export const setMockData = async (): Promise<User[]> => {

  const currentUsers = localStorage.getItem('r-users') ?? '[]'
  const existingUsers = JSON.parse(currentUsers) as User[]

  const data = JSON.stringify([...existingUsers, ...users])

  localStorage.setItem('r-users', data)

  return users as unknown as User[];
}
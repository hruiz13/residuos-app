import { User } from "../models/User";

export const register = async (userData: Partial<User>): Promise<boolean> => {

  const newUser:Partial<User> = {
    ...userData,
    role: 'user',
    id: crypto.randomUUID(),
    puntosAcumulados: 0,
  }

  const currentUsers = localStorage.getItem('r-users') ?? '[]'

  const data = JSON.stringify([...JSON.parse(currentUsers), newUser])

  localStorage.setItem('r-users', data)

  return true;
}
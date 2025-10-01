import { User } from "../models/User";

export const updateUserRol = async (userId: string, newRole: string): Promise<boolean> => {

  const currentUsers = localStorage.getItem('r-users') ?? '[]'
  const users = JSON.parse(currentUsers) as User[]

  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      return { ...user, role: newRole }
    }
    return user
  })

  localStorage.setItem('r-users', JSON.stringify(updatedUsers))

  return true;
}

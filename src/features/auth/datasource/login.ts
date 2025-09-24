import users from '@/mock/users.json';
import {User} from '../models/User';

export async function login(email: string, password: string): Promise<User> {

  const localStorageUsers  = localStorage.getItem('r-users') ?? '[]'
  console.log('🚀 ~ login ~ localStorageUsers:', localStorageUsers)

  const allUsers = [...JSON.parse(localStorageUsers), ...users] as User[]
  console.log('🚀 ~ login ~ allUsers:', allUsers)

  const user = allUsers.find((u: any) => u.email === email && u.password === password);

  if (user) {
    return new User(
      user.id ?? '',
      user.nombres ?? '',
      user.apellidos ?? '',
      user.tipoDni ?? '',
      user.numeroDni ?? '',
      user.direccion ?? '',
      user.codigoIndicativo ?? '',
      user.celular ?? '',
      user.puntosAcumulados ?? 0,
      user.email ?? '',
      user.password ?? '',
      user.role as 'admin' | 'user' | 'company' | 'collector' ?? 'user'
    );
  } else {
    throw new Error('Invalid email or password');
  }
}
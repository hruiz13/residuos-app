import users from '@/mock/users.json';
import {User} from '../models/User';

export async function login(email: string, password: string): Promise<User> {

  const localStorageUsers  = localStorage.getItem('r-users') ?? '[]'

  const allUsers = [...JSON.parse(localStorageUsers), ...users] as User[]

  const user = allUsers.find((u) => u.email === email && u.password === password);

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
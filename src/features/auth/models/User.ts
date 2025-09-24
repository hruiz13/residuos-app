export class User {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDni: string;
  numeroDni: string;
  direccion: string;
  codigoIndicativo: string;
  celular: string;
  puntosAcumulados: number;

  email: string;
  password: string;
  role: 'admin' | 'user' | 'company' | 'collector';

  constructor(
    id: string,
    nombres: string,
    apellidos: string,
    tipoDni: string,
    numeroDni: string,
    direccion: string,
    codigoIndicativo: string,
    celular: string,
    puntosAcumulados: number,
    email: string,
    password: string,
    role: 'admin' | 'user' | 'company' | 'collector'
  ) {
    this.id = id;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.tipoDni = tipoDni;
    this.numeroDni = numeroDni;
    this.direccion = direccion;
    this.codigoIndicativo = codigoIndicativo;
    this.celular = celular;
    this.puntosAcumulados = puntosAcumulados;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
/* 
[
  {
    "id": "1",
    "nombres": "Juan",
    "apellidos": "Gómez",
    "email": "juan.perez@ejemplo.com",
    "tipoDni": "DNI",
    "numeroDni": "12345678",
    "direccion": "Calle Falsa 123",
    "codigoIndicativo": "LIMA01",
    "celular": "987654321",
    "puntosAcumulados": 150,
    "password": "password123",
    "role": "admin"
  }
] */
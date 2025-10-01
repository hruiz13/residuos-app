export class Request {
  id: string;
  userId: string
  fecha: string;
  hora: string;
  localidad: string;
  direccion: string
  tipoResiduo: string;
  estado: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'assigned';
  pesoResiduo: number; // in kg
  putosObtenidos: number;
  collectorId: string;

  constructor(
    id: string,
    userId: string,
    fecha: string,
    hora: string,
    localidad: string,
    direccion: string,
    tipoResiduo: string,
    estado: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'assigned',
    pesoResiduo: number,
    putosObtenidos: number,
    collectorId: string
  ) {
    this.id = id;
    this.userId = userId;
    this.fecha = fecha;
    this.hora = hora;
    this.localidad = localidad;
    this.direccion = direccion;
    this.tipoResiduo = tipoResiduo;
    this.estado = estado;
    this.pesoResiduo = pesoResiduo;
    this.putosObtenidos = putosObtenidos;
    this.collectorId = collectorId;
  }
}
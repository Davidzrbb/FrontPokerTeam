export class Presence {
  idPresence: number;
  idUser: number;
  dayPresence: Date;
  validatePresence: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(idPresence: number, idUser: number, dayPresence: Date, validatePresence: number, createdAt: Date, updatedAt: Date) {
    this.idPresence = idPresence;
    this.idUser = idUser;
    this.dayPresence = dayPresence;
    this.validatePresence = validatePresence;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

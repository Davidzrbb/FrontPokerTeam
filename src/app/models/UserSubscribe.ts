export class UserSubscribe {
  idUser: number | undefined;
  login: string;
  password: string;
  name: string;
  lastname: string;
  promo: string;
  role: string;

  constructor(login: string, password: string, name: string, lastname: string, promo: string, role: string) {
    this.login = login;
    this.password = password;
    this.name = name;
    this.lastname = lastname;
    this.promo = promo;
    this.role = role;
  }
}

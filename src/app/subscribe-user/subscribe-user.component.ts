import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SubscribeService} from "../services/subscribe-service";
import {UserSubscribe} from "../models/UserSubscribe";


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe-user.component.html',
  styleUrls: ['./subscribe-user.component.scss']
})

export class SubscribeUserComponent implements OnInit {
  public returnError = false;
  public returnMessage: string = "";


  constructor(private subscribeService: SubscribeService, private router: Router) {
  }

  ngOnInit(): void {

  }

  closeAlert() {
    this.returnError = false;
  }

  subscribeUser(name: string, lastname: string, login: string, password: string, promo: string): void {
    if (name.trim() === "" || lastname.trim() === "" || login.trim() === "" || password.trim() === "" || promo.trim() === "") {
      this.returnError = true;
      this.returnMessage = "Veuillez remplir tous les champs";
      return;
    }
    if (name.match(/[^a-zA-Z\d]/g) || lastname.match(/[^a-zA-Z\d]/g) || login.match(/[^a-zA-Z\d]/g) || password.match(/[^a-zA-Z\d]/g) || promo.match(/[^a-zA-Z\d]/g)) {
      this.returnError = true;
      this.returnMessage = "Veuillez ne pas utiliser de caractères spéciaux";
      return;
    }
    if (name.length < 3 || lastname.length < 3 || login.length < 3 || password.length < 3) {
      this.returnError = true;
      this.returnMessage = "Veuillez remplir tous les champs";
      return;
    }
    if (name.length > 20 || lastname.length > 20 || login.length > 20) {
      this.returnError = true;
      this.returnMessage = "Veuillez ne pas dépasser 20 caractères";
      return;
    }
    if (password.length > 20) {
      this.returnError = true;
      this.returnMessage = "Veuillez ne pas dépasser 20 caractères";
      return;
    }
    let userSubscribe = new UserSubscribe(login, password, name, lastname, promo, "user");
    this.subscribeService.subscribe(userSubscribe).subscribe(
      res => {
        if (res.response) {
          this.router.navigate(['/login']);
        }
      },
      error => {
        this.returnError = true;
        this.returnMessage = error.error.message;
      });

  }
}

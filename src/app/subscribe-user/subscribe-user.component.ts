import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SubscribeService} from "../services/subscribe-service";


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe-user.component.html',
  styleUrls: ['./subscribe-user.component.scss']
})

export class SubscribeUserComponent implements OnInit {
  public returnError = false;
  public role = "parents";


  constructor(private subscribeService: SubscribeService, private router: Router) {
  }

  ngOnInit(): void {
    this.modifyRole(this.role)
  }
  
  closeAlert() {
    this.returnError = false;
  }

  modifyRole(roleInput: string) {
    this.role = roleInput;
  }
}

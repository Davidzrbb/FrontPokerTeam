import {Component, OnInit} from '@angular/core';
import {ConnexionService} from "../services/connexion.service";
import {Router} from "@angular/router";
import {UserSubscribe} from "../models/UserSubscribe";
import {PresenceService} from "../services/presence.service";
import {Presence} from "../models/Presence";

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
  public displayPresenceBool: boolean = true;
  public displayHistoryPresenceBool: boolean = false;
  public returnError: boolean = false;
  public returnSuccess: boolean = false;
  public returnMessage: string = "";
  public userConnected: UserSubscribe | null = null;
  public presence: Presence[] | null = null;
  public waitValidateBool: boolean = false;
  public validateBool: boolean = false;
  public refuseBool: boolean = false;
  success: string = "success";
  public demandeRefuseInt: number = 0;
  public demandeValidateInt: number = 0;
  public demandeWaiingInt: number = 0;
  private filterDateBool: boolean = false;

  constructor(private connexionService: ConnexionService, private router: Router, private presenceService: PresenceService) {
  }

  async ngOnInit() {
    await this.initUser();
    this.getPresenceByUserId();
  }

  displayCreatePresence() {
    this.displayPresenceBool = !this.displayPresenceBool;
    this.displayHistoryPresenceBool = false;
  }

  displayHistoryPresence() {
    this.displayHistoryPresenceBool = !this.displayHistoryPresenceBool;
    this.displayPresenceBool = false;
  }

  private async initUser() {
    let user = await this.connexionService.isUserLoggedIn();
    if (!user) {
      await this.router.navigateByUrl("/login");
      return;
    }
    this.userConnected = user;
  }

  closeAlert() {
    this.returnError = false;
    this.returnSuccess = false;
  }

  createPresence(name: string, lastname: string, promo: string) {
    if (this.userConnected) {
      if (name != this.userConnected.name || lastname != this.userConnected.lastname || promo != this.userConnected.promo) {
        this.returnError = true;
        this.returnMessage = "Vos informations ne correspondent pas à vos identifiants";
        return;
      }
      if (name.trim() != "" && lastname.trim() != "" && promo.trim() != "" && this.userConnected.idUser) {
        let idUser = this.userConnected.idUser;
        this.presenceService.create(idUser).subscribe(
          {
            complete: () => {
              this.returnSuccess = true;
              this.returnMessage = "Votre présence a été envoyée à l'administrateur";
              this.waitValidateBool = true;
              this.getPresenceByUserId();
            },
            error: (err: any) => {
              this.returnError = true;
              this.returnMessage = err.error.message;
            }
          }
        )
        ;
      } else {
        this.returnError = true;
        this.returnMessage = "Certains champs sont vides";
        return;
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  private getPresenceByUserId() {
    if (this.userConnected) {
      let idUser = this.userConnected.idUser;
      this.presenceService.getPresenceByUserId(idUser).subscribe(
        {
          next: (res: Presence[]) => {
            this.presence = res;
            this.presence.sort((a, b) => {
              return new Date(b.dayPresence).getTime() - new Date(a.dayPresence).getTime();
            }).forEach(presence => {
              let dayPresence = new Date(presence.dayPresence);
              dayPresence.setHours(0, 0, 0, 0);
              let today = new Date();
              today.setHours(0, 0, 0, 0);
              switch (presence.validatePresence) {
                case 0:
                  if (dayPresence.getTime() == today.getTime()) {
                    this.waitValidateBool = true;
                    this.validateBool = false;
                    this.refuseBool = false;
                  }
                  this.demandeWaiingInt++;
                  break;
                case 1:
                  if (dayPresence.getTime() == today.getTime()) {
                    this.waitValidateBool = false;
                    this.validateBool = true;
                    this.refuseBool = false;
                  }
                  this.demandeValidateInt++;
                  break;
                case 2:
                  if (dayPresence.getTime() == today.getTime()) {
                    this.waitValidateBool = false;
                    this.validateBool = false;
                    this.refuseBool = true;
                  }
                  this.demandeRefuseInt++;
                  break;
              }
            });
          },
          error: (err: any) => {
            this.returnError = true;
            this.returnMessage = err.error.message;
          }
        });
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  filterDate() {
    if (this.presence) {
      if (this.filterDateBool) {
        this.presence.sort((a, b) => {
          return new Date(b.dayPresence).getTime() - new Date(a.dayPresence).getTime();
        });
        this.filterDateBool = false;
      } else {
        this.presence.sort((a, b) => {
          return new Date(a.dayPresence).getTime() - new Date(b.dayPresence).getTime();
        });
        this.filterDateBool = true;
      }
    }
  }
}

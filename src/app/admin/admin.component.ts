import {Component, OnInit} from '@angular/core';
import {Presence} from "../models/Presence";
import {ConnexionService} from "../services/connexion.service";
import {Router} from "@angular/router";
import {PresenceService} from "../services/presence.service";
import {UserSubscribe} from "../models/UserSubscribe";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public displayUpdatePresenceBool: boolean = true;
  public displayExtractPresenceBool: boolean = false;
  public returnError: boolean = false;
  public returnMessage: string = "";
  public returnSuccess: boolean = false;
  public success: string = "success";
  public presence: Presence[] | null = null;
  public presenceValidate: Presence[] | null = null;
  public adminPresence: { name: string, lastname: string, dayPresence: Date, idPresence: number, promo: string }[] = [];
  public adminPresenceValidate: { name: string, lastname: string, dayPresence: Date, idPresence: number, promo: string, open: number, idUser: number | undefined }[] = [];

  constructor(private connexionService: ConnexionService, private router: Router, private presenceService: PresenceService) {
  }

  async ngOnInit() {
    await this.getAllPresence();
  }

  displayUpdatePresence() {
    this.displayUpdatePresenceBool = !this.displayUpdatePresenceBool;
    this.displayExtractPresenceBool = false;
  }

  displayExtractPresence() {
    this.displayExtractPresenceBool = !this.displayExtractPresenceBool;
    this.displayUpdatePresenceBool = false;
  }

  closeAlert() {
    this.returnError = false;
    this.returnSuccess = false;
  }

  private getAllPresence() {
    this.adminPresence = [];
    this.presenceService.getAllPresence().subscribe({
      next: (presence: Presence[]) => {
        this.presence = presence.filter(presence => presence.validatePresence === 0);
        this.presenceValidate = presence.filter(presence => presence.validatePresence === 1);
      },
      complete: () => {
        if (this.presence) {
          this.getUserById(this.presence, false);
        }
        if (this.presenceValidate) {
          this.getUserById(this.presenceValidate, true);
        }
      },
      error: (err: any) => {
        this.returnError = true;
        this.returnMessage = err.error.message;
      }
    });
  }

  private getUserById(presence: Presence[] | null, validatePresence: boolean) {
    let userPresence: { name: string, lastname: string, dayPresence: Date, idPresence: number, promo: string, open: number, idUser: number | undefined };
    this.adminPresence = [];
    this.adminPresenceValidate = [];
    if (presence) {
      presence.forEach(presence => {
        this.connexionService.getUserById(presence.idUser).subscribe({
          next: (user: UserSubscribe) => {
            userPresence = {
              name: user.name,
              lastname: user.lastname,
              dayPresence: presence.dayPresence,
              idPresence: presence.idPresence,
              promo: user.promo,
              open: 0,
              idUser: user.idUser
            };
            if (!validatePresence) {
              this.adminPresence.push(userPresence);
            } else {
              this.adminPresenceValidate.push(userPresence);
              if (this.adminPresenceValidate.length > 0) {
                this.adminPresenceValidate.forEach(adminPresenceValidate => {
                  if (adminPresenceValidate.idUser === userPresence.idUser) {
                    adminPresenceValidate.open++;
                  }
                });
                this.adminPresenceValidate = this.adminPresenceValidate.filter((obj, index, self) =>
                    index === self.findIndex((t) => (
                      t.idUser === obj.idUser
                    ))
                );
                console.log(this.adminPresenceValidate);
              }
            }
          },
          error: (err: any) => {
            this.returnError = true;
            this.returnMessage = err.error.message;
          }
        });
      });

    }
  }

  updatePresence(validatePresence: number, idPresence: number) {
    if (!validatePresence || !idPresence) {
      this.returnError = true;
      this.returnMessage = "Certains champs sont vides";
      return;
    }
    this.presenceService.updatePresence(validatePresence, idPresence).subscribe({
      next: () => {
        this.returnSuccess = true;
        this.returnMessage = "La présence a été mise à jour";
        this.getAllPresence();
      }
      , error: (err: any) => {
        this.returnError = true;
        this.returnMessage = err.error.message;
      }
    });

  }

  extractCsv() {
    this.presenceService.exportCsv(this.adminPresenceValidate);
  }
}

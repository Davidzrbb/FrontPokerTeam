import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UserSubscribe} from "../models/UserSubscribe";


@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  private urlSubscribe = `${environment.apiUrl}/user/subscribe`;

  constructor(private http: HttpClient) {
  }

  subscribe(userSubscribe: UserSubscribe): Observable<any> {
    return this.http.post<any>(this.urlSubscribe, userSubscribe);
  }

}


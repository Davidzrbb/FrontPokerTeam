import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private urlCreate = `${environment.apiUrl}/presence/create`;

  constructor(private http: HttpClient) {
  }

  create(idUserInt: number | null): Observable<any> {
    let idUser = {idUser: idUserInt};
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.post<any>(this.urlCreate, idUser, header);
  }

  getPresenceByUserId(idUser: number | undefined): Observable<any> {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(`${environment.apiUrl}/presence/getById/${idUser}`, header).pipe(
      map((res: { presence: any; }) => {
        return res.presence;
      }));
  }

  getAllPresence() {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    return this.http.get<any>(`${environment.apiUrl}/presence/all`, header).pipe(
      map((res: { presence: any; }) => {
        return res.presence;
      }));
  }

  updatePresence(validatePresence: number, idPresence: number) {
    let token = localStorage.getItem("token");
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
    }
    let step = {step: validatePresence};
    return this.http.put<any>(`${environment.apiUrl}/presence/update/${idPresence}`, step, header);
  }

  exportCsv(adminPresenceValidate: { name: string; lastname: string; dayPresence: Date; idPresence: number; promo: string; open: number; idUser: number | undefined }[]) {
    this.downloadFile(adminPresenceValidate);
  }

  downloadFile(data: any, filename = 'data') {
    let arrHeader = ["name", "lastname", "promo", "open"];
    let csvData = this.ConvertToCSV(data, arrHeader);
    let blob = new Blob(['\ufeff' + csvData], {type: 'text/csv;charset=utf-8;'});
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "Modèle bilan points opens.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: string, headerList: string[]) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    let newHeaders = ["Nom", "Prénom", "Promo", "Open"];
    for (let index in newHeaders) {
      row += newHeaders[index] + ';';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        line +=  this.strRep(array[i][head])+ ';';
      }
      str += line + '\r\n';
    }
    return str;
  }

  strRep(data: any) {
    if (typeof data == "string") {
      return data.replace(/,/g, " ");
    } else if (typeof data == "undefined") {
      return "-";
    } else if (typeof data == "number") {
      return data.toString();
    } else {
      return data;
    }
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as global from './variablesGlobales';
import { SettingsApp } from '../_common-model/settings-app';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class NotificacionesService {

    apiURL = SettingsApp.app.urlAsuntos;
    
  constructor(private http: HttpClient) { }

  traerNotifUsuario(user: any): Observable<any> {
    return this.http.get(this.apiURL + '/notificaciones/' + user, httpOptions);
  }

  traerNotifNoLeidasUsuario(user: any): Observable<any> {
    return this.http.get(this.apiURL + '/notificaciones/porUsuario/' + user, httpOptions);
  }

  leerNotificacion(noti: any): Observable<any> {
    return this.http.put(this.apiURL + '/notificaciones/notificacionLeida/' + noti, httpOptions);
  }

}
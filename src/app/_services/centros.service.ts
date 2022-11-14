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

export class CentrosService {

  private apiURL = SettingsApp.app.urlCentros + '/centros';


  constructor(private http: HttpClient) { }

  // centroPorId(id: any): Observable<any> {
  //   return this.http.get( this.apiURL + '/obtenerCentro/' + id, httpOptions);
  // }

  centroPorId(id: any): Observable<any> {
    return this.http.get( this.apiURL + '/obtenerCentroPorId/' + id, httpOptions);
  }

  

}
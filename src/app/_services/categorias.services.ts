import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as global from './variablesGlobales';
import { SettingsApp } from '../_common-model/settings-app';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };
    
  @Injectable({
    providedIn: 'root'
  })

  export class CategoriasService {

    private apiURL = SettingsApp.app.urlCategorias + '/categorias';

    constructor(private http: HttpClient) { }

    consultarPadres(): Observable<any> {
      return this.http.get( this.apiURL + '/nivel-uno',httpOptions);
    }

    
    consultarHijasId(id:any): Observable<any> {
        return this.http.get( this.apiURL + '/' + id,httpOptions);
    }

    prioridadesCate(): Observable<any> {
      return this.http.get(this.apiURL + '/prioridades', httpOptions) 
    }

    


}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as global from './variablesGlobales';
import { SettingsApp } from '../_common-model/settings-app';
import { catchError } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };
    
  @Injectable({
    providedIn: 'root'
  })

  export class AutoAyudaService {

    private apiURL = SettingsApp.app.urlAutoAyuda + '/autoayuda';

    constructor(private http: HttpClient) { }

    traerAutoAyudaTodo(): Observable<any> {
        return this.http.get( encodeURIComponent(this.apiURL + '/all/') ,httpOptions);
      }

    traerAutoAyudaPorId(idCategoria):Observable<any>{
        return this.http.get( encodeURIComponent(this.apiURL + '/'+ idCategoria + '/0'),httpOptions);
    }

    crearEncuestaSatisfaccion(request:any): Observable<any> {
      return this.http.post( encodeURIComponent(this.apiURL + '/encuesta'),request,httpOptions);
    }

    
  evaluacion(request: any): Observable<any> {
    return this.http.post(encodeURIComponent(this.apiURL + '/evaluacion'), request, httpOptions);
  }
 
    descargarAnexoAutoAyuda(id: any): Observable<HttpResponse<Blob>> {
      return this.http.get(encodeURIComponent(this.apiURL + '/anexo/' + id), {
        responseType: "blob",
        headers: new HttpHeaders().append("Content-Type", "application/json")
      }).pipe(
        catchError(
          this.handleError<any>(
            'Error al generar el exportacion',
            ''
          )
        )
      );
  
    }

    private handleError<T>(message: string, operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        return of(result as T);
      };
    }
  
  

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import * as global from './variablesGlobales';
import { catchError } from 'rxjs/operators';
import { SettingsApp } from '../_common-model/settings-app';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})

export class AsuntosService {

  private apiURL = SettingsApp.app.urlAsuntos + '/asuntos';


  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer,) { }

  consultarAsuntosTodos(): Observable<any> {
   

    return this.http.get(encodeURIComponent(this.apiURL + '/consultaAsuntosTodo'), httpOptions) 
  }


  crearAsunto(request: any): Observable<any> {
    let epua:any  =  ( encodeURIComponent(this.apiURL + environment.altaAsun));
    return this.http.post(epua , request, httpOptions) 
  }

  detalleAsunto(folio: any): Observable<any> {
    let path = encodeURIComponent(`${this.apiURL}${'/cargarAsunto/'} ${folio}`);
    return this.http.get( path, httpOptions) 
  }

  reservarAsunto(request: any): Observable<any> {
    let epua:any  = encodeURIComponent( this.apiURL + '/reservarAsuntoResolutor');
    return this.http.post(epua, request, httpOptions) 
  }

  modificarAsuntoPeticionario(request: any): Observable<any> {
    let epua:any  = encodeURIComponent(this.apiURL + '/modificarAsuntoPeticionario');
    return this.http.post(epua, request, httpOptions) 
  }

  peticionInformacionResolutor(request: any): Observable<any> {
    let epua:any  = encodeURIComponent(this.apiURL + '/peticionInformacionResolutor');
    return this.http.post(epua, request, httpOptions) 
  }

  aportarInformacionPeticionario(request: any): Observable<any> {
    let epua:any  = encodeURIComponent(this.apiURL + '/aportarInformacionPeticionario');
    return this.http.post(epua, request, httpOptions) 
  }

  solucionarAsuntoResolutor(request: any): Observable<any> {
    let epua:any  = encodeURIComponent(this.apiURL + '/solucionarAsuntoResolutor');
    return this.http.post(epua, request, httpOptions) 
  }

  clasificacionResolutor(): Observable<any> {
    let epua:any  = encodeURIComponent(this.apiURL + '/catalogoClasificacionResolutor');
    return this.http.get(epua, httpOptions) 
  }
  usuarioPorCodigoNegocio(codigo: any): Observable<any> {
    return this.http.get(encodeURIComponent(this.apiURL + '/usuarioPorCodigo/' + codigo), httpOptions) 
  }

  cierreAsunto(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/cerrarAsunto', request, httpOptions) 
  }


  

  exportaArchivo(id: any): Observable<HttpResponse<Blob>> {
    return this.http.get(encodeURIComponent(this.apiURL + '/descargarArchivo/' + id), {
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
  // Handle Errors 
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(error);
    return throwError(errorMessage);
  }

}
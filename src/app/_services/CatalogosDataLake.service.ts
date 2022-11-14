import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as global from './variablesGlobales';
import { catchError } from 'rxjs/operators';
import { SettingsApp } from '../_common-model/settings-app';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})

export class DataLakeCatalogoService {
    
  apiURL = SettingsApp.app.urlBusqueda + '';
  apiURL2 = SettingsApp.app.urlQRTZ + '';

  constructor(private http: HttpClient) { }


  consultarBasesDatos(): Observable<any> {
    return this.http.get(this.apiURL + '/catalogoBaseDatos/getAllCatBaseDatos'  , httpOptions);
  }

  runJobs(SchedulerJobInfo:any): Observable<any> {
    return this.http.post(this.apiURL2 + '/api/runJob'  , SchedulerJobInfo,  httpOptions);
  }

  consultarBitacora(): Observable<any> {
    return this.http.get(this.apiURL + '/bitacora/getAllBitacora'  , httpOptions);
  }

  
  
  grabarBusqueda(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/guardarBusqueda', request, httpOptions);
  }


  traerTodosAsuntos(user: any): Observable<any> {
    return this.http.get( this.apiURL + '/getAll/' + user, httpOptions);
  }

  exportaArchivo(id: any): Observable<HttpResponse<Blob>> {
    return this.http.get(this.apiURL + '/asuntos/descargarArchivo/' + id, {
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

  busquedaFiltradaPeticionario(pagina: any,request:any): Observable<any> {
    return this.http.post( this.apiURL + '/peticionario/' + pagina,request, httpOptions);
  }

  borrarFiltrosId(idCriterio){
    
    return this.http.delete( this.apiURL + '/delete/' + idCriterio, httpOptions);
    
  }



  private handleError<T>(message: string, operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }


}
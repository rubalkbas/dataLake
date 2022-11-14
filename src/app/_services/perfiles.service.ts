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

export class PerfilesService {

  apiURL = SettingsApp.app.urlPerfil;


  constructor(private http: HttpClient) { }

  obtenerFunciones(): Observable<any> {
    return this.http.get(this.apiURL + '/funciones/todos', httpOptions);
  }

  obtenerFuncionesActivas(): Observable<any> {
    return this.http.get(this.apiURL + '/funciones/obtenerFuncionesActivos', httpOptions);
  }

  crearFuncion(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/funciones/crearFuncion', request, httpOptions);
  }

  editarEstatusFuncion(request: any): Observable<any> {
    return this.http.put(this.apiURL + '/funciones/actualizarFuncion', request, httpOptions);
  }

  funcionesPorRol(id: any): Observable<any> {
    return this.http.get(this.apiURL + '/roles/obtenerFuncionesPorRol/' + id, httpOptions);
  }

  asignarFuncionRol(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/roles/agregarFuncionARol', request, httpOptions);
  }

  eliminarFuncionRol(id: any): Observable<any> {
    return this.http.delete(this.apiURL + '/roles/eliminarRolFuncion/' + id, httpOptions);
  }

  obtenerRoles(): Observable<any> {
    return this.http.get(this.apiURL + '/roles/obtenerRoles', httpOptions);
  }

  obtenerRolesActivos(): Observable<any> {
    return this.http.get(this.apiURL + '/roles/obtenerRolesActivos', httpOptions);
  }

  crearRol(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/roles/crearRol', request, httpOptions);
  }

  editarEstatusRol(request: any): Observable<any> {
    return this.http.put(this.apiURL + '/roles/actualizarRol', request, httpOptions);
  }

  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.apiURL + '/usuarios/obtenerUsuarios', httpOptions);
  }

  crearUsuario(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/usuarios/guardarUsuario', request, httpOptions);
  }

  eliminarUusario(codigo: any): Observable<any> {
    return this.http.delete(this.apiURL + '/usuarios/eliminarUsuario/' + codigo, httpOptions);
  }

  buscarUsuario(request: any): Observable<any> {
    return this.http.post(this.apiURL + '/usuarios/obtenerUsuariosPorFiltros', request, httpOptions);
  }

  editarEstatusUsuario(request: any): Observable<any> {
    return this.http.put(this.apiURL + '/usuarios/actualizarEstatusUsuario', request, httpOptions);
  }

  obtenerUsuarioCodigo(codigo: any): Observable<any> {
    return this.http.get(this.apiURL + '/usuarios/obtenerUsuario/' + codigo, httpOptions);
  }

  obtenerPerfilamientoUsuario(codigo: any): Observable<any> {
    return this.http.get(this.apiURL + '/usuarios/obtenerPerfilamientoUsuario/' + codigo, httpOptions);
  }


  
}
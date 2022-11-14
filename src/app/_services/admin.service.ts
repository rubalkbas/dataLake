import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SettingsApp } from '../_common-model/settings-app';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiURL =  '/';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true
  };

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cookieService:CookieService
  ) { }

  guardaUsuario(usuario: any): Observable<any> {
    let url = this.apiURL + 'usuarios/guardar';
    return this.http.post(url, usuario, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getUsuariosPorFiltro(filtro: any): Observable<any> {
    let url = this.apiURL + 'usuarios/consultarPorFiltros?codigoUsuario=' + filtro.codigoUsuario + '&nombreUsuario=' + filtro.nombreUsuario + '&idRol=' + filtro.idRol;
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getUsuarios(filtro: any): Observable<any> {
    let url = this.apiURL + 'usuarios/consultarTodos?u=' + filtro.usuario + '&n=' + filtro.nombre + '&r=' + filtro.rol;
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  EliminaUsuario(id: number): Observable<any> {
    let url = this.apiURL + 'usuarios/eliminarUsuarioRol/' + id;
    return this.http.delete(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  actualizaUsuario(user: any): Observable<any> {
    let url = this.apiURL + 'usuarios/toogleActivacionUsuario/' + user.idusuario + '/' + user.status;
    return this.http.post(url, {}, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
  guardaRol(rol: any): Observable<any> {
    let url = this.apiURL + 'roles/guardar';
    return this.http.post(url, rol, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  actualizaRol(rol: any): Observable<any> {
    let url = this.apiURL + 'roles/toogleActivacionRol/' + rol.id + '/' + rol.status;
    return this.http.post(url, rol, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  agregaFuncionARol(rol: any): Observable<any> {
    let url = this.apiURL + 'roles/guardarRolFuncion/' + rol.idrol + '/' + rol.idfuncion;
    return this.http.post(url, rol, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  quitaFuncionARol(id: number): Observable<any> {
    let url = this.apiURL + 'roles/eliminarRolFuncion/' + id;
    return this.http.delete(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getRoles(): Observable<any> {
    let url = this.apiURL + 'roles/consultarTodos';
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getRolesActivos(): Observable<any> {
    let url = this.apiURL + 'roles/consultarRolesActivos';
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getFuncionesRol(id): Observable<any> {
    let url = this.apiURL + '/roles/consultarFuncionesPorIdRol/' + id;
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  guardaFuncion(funcion: any): Observable<any> {
    let url = this.apiURL + 'funciones/guardar';
    return this.http.post(url, funcion, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  actualizaFuncion(funcion: any): Observable<any> {
    let url = this.apiURL + 'funciones/actualizar';
    return this.http.post(url, funcion, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getFuncionesTodas(): Observable<any> {
    let url = this.apiURL + 'funciones/consultarTodos';
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  getFuncionesActivas(): Observable<any> {
    let url = this.apiURL + 'funciones/consultarActivos';
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  validaSesion(): Observable<any> {
    let url = SettingsApp.app.urlSantec + '/autenticacion/cookie';
    //headersValues.append('cookie-aplicativa', this.cookieService.getCookie());
    //  url = this._configService.urlSeguridad + '/autenticacion/cookie';
    return this.http.get(url, {
      headers: new HttpHeaders().append("cookie-aplicativa", this.cookieService.getCookie(SettingsApp.app.cookieName))
     // headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  initUser(id): Observable<any> {
    let url = this.apiURL + 'perfiles/consultarPorIdUsuario/' + id;
    return this.http.get(url, {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

}

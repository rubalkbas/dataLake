import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const TIMERTOKEN_KEY = 'timerToken';
const ID_NOMINA = 'idNomina';
const ID_EMPRESA = 'idEmpresa';
const USUARIO_NAME_KEY = 'user-name';
const NOMBRE = 'nombre';
const ORIGEN = 'origen';
const ESTATUS = 'estatus';
const NOMBREEMPRESA = 'nombreEmpresa';
const FUNCIONES_ROL = 'funcionesRol';
const INICIAL = 'inicial'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
    private userLoggedIn = new Subject<boolean>();

    
  constructor(private router: Router) {

    this.userLoggedIn.next(false);
   }

  public signOut(): void {
    window.sessionStorage.clear();
    sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveIdEmpresa(idEmpresa: string): void {
    window.sessionStorage.removeItem(ID_EMPRESA);
    window.sessionStorage.setItem(ID_EMPRESA, idEmpresa);
  }




  public getIdEmpresa(): string {
    return sessionStorage.getItem(ID_EMPRESA);
  }
 

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }


  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }



  public saveIdNomina(idNomina:string): void {
    window.sessionStorage.removeItem(ID_NOMINA);
    window.sessionStorage.setItem(ID_NOMINA, JSON.stringify(idNomina));
  }

  public saveNombre(idNomina:string): void {
    window.sessionStorage.removeItem(NOMBRE);
    window.sessionStorage.setItem(NOMBRE, JSON.stringify(idNomina));
  }

  public saveOrigen(origen:string): void {
    window.sessionStorage.removeItem(ORIGEN);
    window.sessionStorage.setItem(ORIGEN, JSON.stringify(origen));
  }

  
  public saveStatus(estatus:string): void {
    window.sessionStorage.removeItem(ESTATUS);
    window.sessionStorage.setItem(ESTATUS, JSON.stringify(estatus));
  }

  public saveNombreEmpresa(nombreEmpresa:string): void {
    window.sessionStorage.removeItem(NOMBREEMPRESA);
    window.sessionStorage.setItem(NOMBREEMPRESA, JSON.stringify(nombreEmpresa));
  }

  public getIdNomina(): any {
    return JSON.parse(sessionStorage.getItem(ID_NOMINA));
  }

  public getNombre(): any {
    return JSON.parse(sessionStorage.getItem(NOMBRE));
  }

  public getOrigen(): any {
    return JSON.parse(sessionStorage.getItem(ORIGEN));
  }

  public getStatus(): any {
    return JSON.parse(sessionStorage.getItem(ESTATUS));
  }

  public getNombreEmpresa(): any {
    return JSON.parse(sessionStorage.getItem(NOMBREEMPRESA));
  }
  
  
// RECUPERAR EL TIMER TOKEN
public getTimerToken(): string {
    return localStorage.getItem(TIMERTOKEN_KEY);
  }

  // GUARDAR EL TIMER TOKEN
  public setTimerToken(timerToken: string): void {
    localStorage.setItem(TIMERTOKEN_KEY, timerToken);
    this.userLoggedIn.next(true);
  }
// RECUPERAR EL TIMER TOKEN
public getUserName(): string {
  return window.sessionStorage.getItem(USUARIO_NAME_KEY);
}

// GUARDAR EL TIMER TOKEN
public setUserName(user: string): void {

  window.sessionStorage.removeItem(USUARIO_NAME_KEY);
  window.sessionStorage.setItem(USUARIO_NAME_KEY, (user));

}

public getFuncionesRol(): string {
  return sessionStorage.getItem(FUNCIONES_ROL);
}

public setFuncionesRol(funcsRol: string): void {
  sessionStorage.removeItem(FUNCIONES_ROL);
  sessionStorage.setItem(FUNCIONES_ROL, funcsRol);
}

public getInicial(): any{
  return JSON.parse(sessionStorage.getItem(INICIAL));
}

public setInicial(ini: string): void {
  window.sessionStorage.removeItem(INICIAL);
  window.sessionStorage.setItem(INICIAL, JSON.stringify(ini));
}


}

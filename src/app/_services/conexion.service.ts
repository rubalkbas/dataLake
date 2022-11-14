import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { SettingsApp } from '../_common-model/settings-app';
import { map, catchError } from 'rxjs/operators';

// Clase que realiza las peticiones web
@Injectable({ providedIn: 'root' })
export class ConexionService implements HttpInterceptor {

  // se declaran las variables
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {}

  /**
   * Funcion interceptor que verifica si existe el token de acceso si es requerido
   * 
   * @param req peticion de saida
   * @param next Manejador para la devollucion
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Por definir
    if (req.url.search('config.json') === -1 && req.url.search('Sal') === -1 && req.url.search('dse_operationName=sesionManager') === -1) {
      if (environment.production) {
        //SettingsApp.pixelURL = SettingsApp.app.route.urlPortalSession + new Date().getTime();
      }  
        //enviar usuario para auditoria

    }
    
    // derivamos los errores al error handle 
    return next.handle(req).pipe(catchError(error => { throw error }));
  }


/**
   * La funcion principal que inicializa todo el tema de seguridad.
   * Primero lee del fichero config.json toda la configuracion
   */
  public async load(): Promise<boolean> {
    let headersValues = new Headers();
    
    // Ponemos en el header todas los valores necesarios
    headersValues.append('Access-Control-Allow-Origin', '*');
    headersValues.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headersValues.append('Accept', 'application/json');
    headersValues.append('Content-Type', 'application/json;charset=UTF-8');
    headersValues.append('Pragma', 'no-cache');
    headersValues.append('Cache-Control', 'no-cache');

    //OnInit from App.component, this method gets the config.json from either Assets or Git
    //The desicion is made by checking the enviroment variable ConfigURL which has both the route of the Git file, and our Assets file.
    let miInit = { method: 'GET', headers: headersValues };
    console.info('CAU CONFIG.JSON:' + environment.ConfigURL);
    let data = await (await fetch(environment.ConfigURL, miInit)).json();
    SettingsApp.app = data.app;

    //console.info('CAU Version:' + SettingsApp.app.version);
    console.info('CAU Environment:' + SettingsApp.app.environment);
    console.info('CAU urlGateway:' + SettingsApp.app.urlAsuntos);

    if (!environment.production) {
      // Si estamos en desarrollo local, seteamos la cookie fingida
      
    } else {
      // Si estamos en PaaS, desencriptamos la cookie para traer el usuario
      //headersValues.append('cookie-aplicativa', this.cookieService.getCookie());
      
      //This method gets the user from GSControl cookie decription service.
      let miInit2 = { method: 'GET', headers: headersValues };
      
      //TODO Datos del usuario
      //let cookieResponse = await (await fetch(`https://${SettingsApp.app.urlBack}/autenticacion/cookie`, miInit2)).json();
      //SettingsApp.cookie = cookieResponse.response;
    }

    // Devolvemos estado de resolve
    return new Promise((resolve) => { resolve(true) });
    
  }



}



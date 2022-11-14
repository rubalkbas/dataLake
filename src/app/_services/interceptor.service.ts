import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators'; 
import { ServicioCompartido } from './servicioCompartido.service';
 

@Injectable()
export class InboundInterceptor implements HttpInterceptor {
  constructor(private servicioCompartido:ServicioCompartido){
    
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse), 
      map((event: HttpResponse<any>) => {
        

        if(!event.url.includes('/notificaciones/porUsuario')){
            // console.log('soy el interceptooor, esperando un 403 y contengo notificaciones')
            this.servicioCompartido.sendClickEvent();
        }
   

        

        return event;
      }));

  }


}
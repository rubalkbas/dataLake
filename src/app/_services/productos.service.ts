import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as global from './variablesGlobales';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };
    
  @Injectable({
    providedIn: 'root'
  })
export class ProductoService {

    constructor(private http: HttpClient) { }

    consultarCategoriasHija(idPadre): Observable<any> {
        return this.http.post( global.urlServidor + '/ejemplo/consultaCategoriaHija?padre='+ idPadre + '&categoria=0',httpOptions);
      }

    listaProductosCategoria(idNivelCategoria): Observable<any> {
        return this.http.post( global.urlServidor + '/producto/listaProductosCategoria?idNivelCategoria='+ idNivelCategoria,httpOptions);
      }

    listaProductosImagen(seccion,idCategoria,idProducto): Observable<any> {
      return this.http.post( global.urlServidor + '/producto/listaProductos?seccion=' + seccion + '&idCategoria='+idCategoria+ '&idProducto='+idProducto, httpOptions);
    }

    consultaProductos(): Observable<any> {
      return this.http.get( global.urlServidor + '/producto/consultaTodosProductos');
    }

    consultaImagenesProductoPorID(idProducto): Observable<any> {
      return this.http.post( global.urlServidor + '/producto/productoDetalle?idProducto=' + idProducto , httpOptions);
    }

    registraProducto(producto): Observable<any> {
      return this.http.post( global.urlServidor + '/producto/registroProducto',producto, httpOptions);
    }

    //service inyectable

}
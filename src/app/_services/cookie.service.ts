import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {

  private cookieValue: string = '';
  private cookieName = 'cookie_INTRAMX-APPEB-SSO_COMISIONES_MSI';
 

  /**
   * Método para borrar la cookie.
   * @param cname Nombre de la cookie
   */
  public deleteCookie(cname = this.cookieName): void {
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  /**
   * Leer una cookie
   * @param cname Nombre de la cookie
   */
  public getCookie(cname:any): string {
    // Si ya tenemos la cookie, la devolvemos

    console.log('ENTRO AL GETCOOKIE EL NOMBRE QUE TRAIGO ES :' + cname)
    
      // Decodificar la cadena de cookies para manipular las cookies con caracteres especiales, e.j. '$'
      const cookieAplicativa = decodeURIComponent(document.cookie).split(';');
      console.log('hago el split de la cookie')
      console.log(cookieAplicativa)
      for (let i = 0; i < cookieAplicativa.length; i++) {
        let cadena = cookieAplicativa[i];
        while (cadena.charAt(0) === ' ') {
          cadena = cadena.substring(1);
        }

        // Si la cookie se encuentra
        if (cadena.indexOf(`${cname}=`) === 0) {
          // Seteamos y devolvemos el valor de la cookie

          this.cookieValue = cadena.substring(`${cname}=`.length, cadena.length);
          console.log('encuentro la cookie')
          console.log(this.cookieValue)
          return this.cookieValue;
        }
     
    }
    return "";
  }
}

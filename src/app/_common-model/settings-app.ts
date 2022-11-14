

// ********************
// ********************
// CLASE STATIC DE CONFIGURACION GOLDEN
// ********************
// ********************

/**Variables de entorno de todo GOLDEN */
export class SettingsApp {
  // Propiedades Front
  public static app: App;
  
  // Mensaje de Espera
  public static mensajeOperacionesTardada = `la operación puede tardar un poco`;
  public static mensajeConfirmacion = `¿Está de acuerdo?`;
  public static mensajeEspera = `Por favor, espere mientras se ejecuta la operación...`;

  // Maximo numero de elementos para mostrar mensaje de espera
  public static NO_REGISTROS_TABLA = 10;

}

/**Configuraciones de GOLDEN de config.json */
class App {
  applicationName: string;
  cookieName: string;
  environment: string;
  headerTokenName: string;
  production: boolean;
  urlAsuntos: string;
  urlAutoAyuda:string;
  urlBusqueda:string;
  urlCategorias:string;
  urlCentros:string;
  urlPerfil: string;
  urlSantec: string;
  urlIntranetLogin: string;
  version: string;
  urlQRTZ:string;
}


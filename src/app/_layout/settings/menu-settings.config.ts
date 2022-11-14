// Default menu settings configurations

import { Perfiles } from "src/app/_common-model/perfiles";

export interface MenuItem {
  title: string;
  icon: string;
  page: string;
  isExternalLink?: boolean;
  issupportExternalLink?: boolean;
  isStarterkitExternalLink?: boolean;
  badge: { type: string, value: string };
  funcionId:number;
  submenu: {
    items: Partial<MenuItem>[];
  };
  section: string;
}

export interface MenuConfig {
  horizontal_menu: {
    items: Partial<MenuItem>[]
  };
  vertical_menu: {
    items: Partial<MenuItem>[]
  };
}


export const MenuSettingsConfig: MenuConfig = {
  vertical_menu: {
    items: [
      {
        title: "DATA LAKE",
        page: 'null',
        funcionId: Perfiles.ADMINISTRACION,

        submenu:{
          items:[
            {
              title:'BITACORA',
              page:'/dataLake/bitacora',
              funcionId: Perfiles.ADMINISTRACION,

            }         
            
            ,
            {
              title:'Ejemplos',
              page:'/dataLake/mantenimientoCatalogoClaves',
              funcionId: Perfiles.ADMINISTRACION,

            }, /*
            {
              title:'Consulta de Pagos Recibidos',
              page:'/dataLake/pagosRecibidos'
            },
            {
              title:'Cancelacion de Pago de Contribuciones',
              page:'/dataLake/cancelacionPago'
            },
            {
              title:'Envio de Pagos al SAT',
              page:'/dataLake/envioPagoSat'
            },
            {
              title:'Verificacion de sello',
              page:'/dataLake/verificacionSello'
            },
            {
              title:'Consulta de envio de archivos',
              page:'/dataLake/consultaEnvioArchivos'
            }, {
              title:'Pago referenciado SAT',
              page:'/dataLake/pagoReferenciadoSat'
            }, {
              title:'Mantenimiento Pagos Inconcistentes',
              page:'/dataLake/mantenimientoPagosInconsistentes'
            }, */
            {
              title:'Ejemplos',
              page:'/dataLake/catalogoMensajesError',
              funcionId: Perfiles.ADMINISTRACION,

            }
          ]
        }
      },

      {
        title: "CONFIGURACIÓN",
        page: 'null',
        funcionId: Perfiles.ADMINISTRACION,

        submenu:{

          items:[
            {
              title:'RESTRICCIONES',
              page:'/dataLake/bitacora',
              funcionId: Perfiles.ADMINISTRACION,

            }
            

          ]
        }
      },
      {
        title: "CATALOGOS",
        page: 'null',
        funcionId: Perfiles.ADMINISTRACION,

        submenu:{

          items:[

            {
              title:'TABLAS',
              page:'/dataLake/catalogoTablas',
              funcionId: Perfiles.ADMINISTRACION,

            },
            {
              title:'BASES DE DATOS',
              page:'/dataLake/catalogoDB',
              funcionId: Perfiles.ADMINISTRACION,

            }
            ,
            {
              title:'ESTATUS',
              page:'/dataLake/catalogoStatus',
              funcionId: Perfiles.ADMINISTRACION,

            }

            

          ]
        }
      }
     
     
    ]
  },
  horizontal_menu: {
    items: []
  }
};






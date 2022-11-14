import { Injectable } from '@angular/core'; 
import { AdminService } from './admin.service';
import { PerfilesService } from './perfiles.service';
import { TokenStorageService } from './token-storage.service';


interface BaseRolFuncion{
  id: number;
  descripcion: string;
  status: number;
}


interface RolFuncion{
  id: number;
  rol: BaseRolFuncion;
  funcion: BaseRolFuncion;
  status: number;
}


@Injectable({
  providedIn: 'root'
})
export class FuncionesPerfilService {
	
  rolFunciones: any[];

  entroCargarFunciones = false;
	
  mapFuncionesAcceso = new Map<number, number>();
  sesionUser: any = null;

  constructor(
	private _adminService: AdminService,
  private _perfilesService: PerfilesService,
	private tokenStorageService: TokenStorageService
  	) { 
	}


  // SOLO PRUEBAS LOCALES
  public cargaFuncionesRolAcceso(pSesionUser: any) {
    this.entroCargarFunciones = true;
    // console.log('Cargando funciones');
    this.sesionUser = pSesionUser;
    this.tokenStorageService.saveUser(pSesionUser);
    this.tokenStorageService.setUserName(pSesionUser.usuario);
    // console.log(pSesionUser);
    
    this.mapFuncionesAcceso = new Map<number, number>();
    this.mapFuncionesAcceso.set(1, 1);
    this.mapFuncionesAcceso.set(2, 1);
    this.mapFuncionesAcceso.set(3, 1);
    this.mapFuncionesAcceso.set(4, 1);
    this.mapFuncionesAcceso.set(5, 1);
    this.mapFuncionesAcceso.set(6, 1);
    this.mapFuncionesAcceso.set(7, 1);
    this.mapFuncionesAcceso.set(8, 1);
    this.mapFuncionesAcceso.set(9, 1);
    this.mapFuncionesAcceso.set(10, 1);
    this.mapFuncionesAcceso.set(11, 1);
    this.mapFuncionesAcceso.set(12, 1);
    this.mapFuncionesAcceso.set(13, 1);
    this.mapFuncionesAcceso.set(14, 1);
    this.mapFuncionesAcceso.set(15, 1);
    this.mapFuncionesAcceso.set(16, 1);
    this.mapFuncionesAcceso.set(17, 1);
    this.mapFuncionesAcceso.set(18, 1);
    this.mapFuncionesAcceso.set(19, 1);
    this.mapFuncionesAcceso.set(20, 1);
    this.mapFuncionesAcceso.set(21, 1);
    this.mapFuncionesAcceso.set(22, 1);
    
    this.tokenStorageService.setFuncionesRol(JSON.stringify(this.mapFuncionesAcceso, this.replacer));
    this.entroCargarFunciones = false;
    // console.log('Funciones cargadas');
    }
    

  
  /* public cargaFuncionesRolAcceso(pSesionUser: any) {
	this.entroCargarFunciones = true;
	// console.log('Cargando funciones');
	this.sesionUser = pSesionUser;
	this.tokenStorageService.saveUser(pSesionUser);
	this.tokenStorageService.setUserName(pSesionUser.usuario);
    this._perfilesService.obtenerPerfilamientoUsuario(pSesionUser.usuario).subscribe((data) => {     
      	this.rolFunciones = data.response.funciones;
		this.mapFuncionesAcceso = new Map<number, number>();
		for (let ind in this.rolFunciones) {
			const idFunc: number =  this.rolFunciones[ind].idFuncion;
			this.mapFuncionesAcceso.set(idFunc, 1);
		}
		this.tokenStorageService.setFuncionesRol(JSON.stringify(this.mapFuncionesAcceso, this.replacer));
		this.entroCargarFunciones = false;
		// console.log('Funciones cargadas');
    return true;
    });

    let valida = this.tokenStorageService.getInicial();
    if (!valida){

      this.tokenStorageService.setInicial('ye')
       window.location.reload() 
    }
    return true;
  } 
 */
  tieneAcceso(funcionId: number): boolean {
	if (this.mapFuncionesAcceso.size > 0) {
	     return this.mapFuncionesAcceso.has(funcionId);
	} else {
		if (!this.entroCargarFunciones && this.sesionUser !== null) {
			// console.log('Entro carga funciones');
			this.mapFuncionesAcceso = this.getFuncionesRol();
			if (!(this.mapFuncionesAcceso !== null && this.mapFuncionesAcceso !== undefined && this.mapFuncionesAcceso.size > 0)) {
				this.cargaFuncionesRolAcceso(this.sesionUser);
			}
		}
		return false;
	}
  }  

  replacer(key, value) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  getFuncionesRol(): any {
    return JSON.parse(this.tokenStorageService.getFuncionesRol(), this.reviver);
  }


}
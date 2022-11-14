import {ModelArchivo} from './archivosAsunto.model'
import {ModelUrls} from './urlsAsunto.model'
import {ModelFormulario} from './formularioAsunto.model'

export interface ModelAsunto2 {
    
    peticionario?:
        {
            codigoUsuario?: string,
            nombre?: string,
            mail?: string,
            telefono?: string,
            movil?: string,
            idCentro?: number
        },
    dscBreve?: string,
    dscDetallada?: string,
    direccionContacto?: string,
    telefonoContacto?: string,
    idCategoria?: number,
    idPrioridadPeticionario?: number,
    modificaciones?: string,

    archivos?: ModelArchivo[],
    urls?: ModelUrls[],
    formularios?: [ModelFormulario]

}
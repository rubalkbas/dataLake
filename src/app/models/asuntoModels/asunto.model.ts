export interface ModelAsunto {

    nombre?: string,
    telefono?: string,
    movil?: string,
    email?: string,
    direccionContacto?: string,
    movilContacto?: string,
    descripcionBreveAsunto?: string,
    fechaCreacion?: Date,
    estadoAsunto?: string,
    motivoReapertura?: string,
    categoria?: string,
    centro?: string,
    telefonoCentro?: string,
    direccionCentro?: string,
    descripcionDetallada?: string,   
    historico?:[any],
    informacionRequerida?:[any],
    quejas?:[any],
    anexos?:[any]
    
}
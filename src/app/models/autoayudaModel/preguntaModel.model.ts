export class ModelPregunta {
    categoriaPadre: {
        codUsrioAct: number,
        dscBreveCateg: string,
        dscCatAsnto: string,
        fchActAud: Date,
        flgEdoCat: number,
        idCatAsntPk: number,
        idCategAsntPadreFk: number,
        idPrioCatFk: number,
        numTmpoSla: number,
    };
    codUsrioAct: number;
    fchActAud: Date;
    flgEdoPregRelCat: number;
    grlPreg: string;
    grlResp: string;
    id: number;
    idCatAsntFk: number;


}

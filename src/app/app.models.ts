export class Category {
  constructor(public id: number, 
              public name:string, 
              public hasSubCategory: boolean,
              public parentId: number){ }
}

export class Product {
  constructor(public idProducto: number,
              public name: string,
              public images: Array<any>,
              public oldPrice: number,
              public newPrice: number,
              public discount: number,
              public ratingsCount: number,
              public ratingsValue: number,
              public description: string,
              public availibilityCount: number,
              public cartCount: number,
              public color: Array<string>,
              public size: Array<string>,
              public weight: number,
              public categoryId: number,
              public condicion: number,
              public idCatMarca: number
              ){ }
}
export class Banner {
  constructor(public idImgBanner: number, 
              public status:number, 
              public subtitulo: string,
              public titulo: string,
              public urlImg: string, 
              public idUsuario: number,
              ){ }
}

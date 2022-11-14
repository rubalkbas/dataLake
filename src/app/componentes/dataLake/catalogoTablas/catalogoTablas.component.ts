
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DataLakeCatalogoService } from "src/app/_services/CatalogosDataLake.service";
import Swal from "sweetalert2";
import { ActualizaClaveComponent } from "./actualizaClave/actualizaClave.component";
import { AltaClaveComponent } from "./altaClave/altaClave.component";


export interface CatalogoTabla {
  idtabla: string;
  baseDatos: string;
  tabla: string;
 
}

const ELEMENT_DATA: CatalogoTabla[] = [
  {idtabla : '1', baseDatos: 'Ingenium', tabla : 'Ejemplo TABLA 1'},
  {idtabla : '2', baseDatos: 'OnBase', tabla : 'Ejemplo TABLA 2'},
  {idtabla : '3', baseDatos: 'Ingenium', tabla : 'Ejemplo TABLA 3'},
  
];

@Component({
    selector: 'app-catalogoTablas',
    templateUrl: './catalogoTablas.component.html',
    styleUrls: ['./catalogoTablas.component.scss']
  })
  
  export class CatalogoTablasComponent implements OnInit {


    displayedColumns: string[] = ['tabla','baseDatos','accion'];
    dataSource = new MatTableDataSource<CatalogoTabla>(ELEMENT_DATA);
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }

    constructor(  public dialog: MatDialog,
      private dataLakeCatalogoService:DataLakeCatalogoService ) {

    }


    ngOnInit(): void {
      this.dataLakeCatalogoService.consultarBasesDatos().subscribe(data=>{

        console.log(data);
        this.dataSource = new MatTableDataSource;
        this.dataSource.data = data.list;
  

      });
    }

    openDialog(): void {

      const dialogRef = this.dialog.open(AltaClaveComponent, {
        width: '1000px',
        height: '465px',
        data: {name:1 },
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }

    openDialog2(): void {

      const dialogRef = this.dialog.open(ActualizaClaveComponent, {
        width: '1000px',
        height: '465px',
        data: {name:1 },
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }

    
  }
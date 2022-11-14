
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { AltaStatusComponent } from "./AltaStatus/altaStatus.component";
 
 


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
    selector: 'app-catalogoStatus',
    templateUrl: './catalogoStatus.component.html',
    styleUrls: ['./catalogoStatus.component.scss']
  })
  
  export class CatalogoStatusComponent implements OnInit {


    displayedColumns: string[] = [ 'idCatEstatus','descEstatus','fechaAltaR','estatusR','accion'];
    dataSource = new MatTableDataSource<CatalogoTabla>(ELEMENT_DATA);
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }

    constructor(  public dialog: MatDialog ) {

    }


    ngOnInit(): void {

    }

    openDialog(): void {

      const dialogRef = this.dialog.open(AltaStatusComponent, {
        width: '1000px',
        height: '465px',
        data: {name:1 },
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }

   

    
  }

import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'app-altaBD',
    templateUrl: './altaBD.component.html',
    styleUrls: ['./altaBD.component.scss']
  })
  
  export class AltaBDComponent implements OnInit {



    constructor(public dialogRef: MatDialogRef<AltaBDComponent> ) {

    }


    ngOnInit(): void {

    }

    guardar(){

      Swal.fire({
  
        icon: 'success',
        title: 'Se ha realizado el registro con éxito',
        showConfirmButton: false,
        timer: 2000,

      })

      this.dialogRef.close();

    }

    
  }
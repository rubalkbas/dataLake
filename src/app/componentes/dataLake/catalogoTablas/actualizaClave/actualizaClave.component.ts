
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
    selector: 'app-actualizaClave',
    templateUrl: './actualizaClave.component.html',
    styleUrls: ['./actualizaClave.component.scss']
  })
  
  export class ActualizaClaveComponent implements OnInit {



    constructor(public dialogRef: MatDialogRef<ActualizaClaveComponent> ) {

    }


    ngOnInit(): void {

    }

    guardar(){

      Swal.fire({
  
        icon: 'success',
        title: 'Se ha realizado la modificación con éxito',
        showConfirmButton: false,
        timer: 2000,

      })

      this.dialogRef.close();

    }


    baja(){

      Swal.fire({
        title: '¿Esta Seguro?',
        text: "¿Desea dar de baja el registro seleccionado?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO'
  
      }).then((result) => {
        if (result.isConfirmed) {
  
          Swal.fire({
  
            icon: 'success',
            title: 'Se ha eliminadoel registro con éxito',
            showConfirmButton: false,
            timer: 2000,
    
          })

          this.dialogRef.close();

          
        }
        
      })

    }

    
  }
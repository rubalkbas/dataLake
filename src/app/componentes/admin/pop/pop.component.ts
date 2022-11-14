import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { MatSelectChange } from '@angular/material/select';

/**
 * Clase de Pop
 * @author MTP
 */

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PopComponent implements OnInit {

  data: any;

  displayedColumns: string[] = ['idFuncion', 'descripcionFuncion', 'acciones'];
  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  funciones: any = [];

  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };

  options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true
  };

  id: number;
  loadingIndicator: true;
  rows: any;
  editing = {};
  row: any;
  panelOpenState = false;

  public form: FormGroup;
  public formGuardar: any;
  nombreFun: string;

  /**
   * Constructor
   */

  constructor(
    public formBuilder: FormBuilder,
    private perfilesService: PerfilesService,
    public dialogRef: MatDialogRef<PopComponent>,
    @Inject(MAT_DIALOG_DATA) public rol: any,

  ) { };

  @ViewChild('TableOneSort', { static: true }) tableOneSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Metodo para asignar la funcion de click a un boton
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
    * On init
    */
  ngOnInit(): void {

    // console.log(this.rol)

    this.form = this.formBuilder.group({
      idRol: [this.rol.idRol],
      idFuncion: [''],
    });

    this.getFunciones();
    this.getFuncionesDeRol();

  }

  /**
   * Metodo de listado de funciones
   */
  getFunciones() {
    this.perfilesService.obtenerFuncionesActivas().subscribe(
      data => {
        this.funciones = data.response;
      });
  }
  /**
     * Metodo de listado de funciones enlazadas con un rol
     */
  getFuncionesDeRol() {

    //// console.log(this.rol)
    this.perfilesService.funcionesPorRol(this.rol.idRol).subscribe(data => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data.response.funciones;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.tableOneSort;
    })
  }
  /**
    * Metodo de asignacion de funciones a los roles
    */
  selectedValue(event: MatSelectChange) {
    this.nombreFun = event.source.triggerValue;

  }
  guardar() {
    if (this.form.value.idFuncion === '') {
      this.form.setErrors({ 'invalid': true });
    } else {
      this.form.setErrors(null);
    }
    if (!this.form.valid) {
      Swal.fire({
        icon: 'warning',
        title: "Es necesario seleccionar una funcion.",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000

      })
    } else {
      this.perfilesService.asignarFuncionRol(this.form.value).subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            title: 'Se guardo correcatmente la funcion: ' + this.nombreFun + ' en el rol: ' + this.rol.descripcion,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
          this.getFuncionesDeRol();
          this.form.reset();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: error.error.responseCode.description,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
        }
      );
    }
  }
  /**
     * Metodo de borrado de funciones asignadas a un rol
     */

  eliminar(element) {
    // console.log(element.idRolFuncion);
    this.perfilesService.eliminarFuncionRol(element.idRolFuncion).subscribe(
      data => {
        // console.log(data);
        Swal.fire({
          icon: 'info',
          title: 'Se elimino correctamente la funcion: ' + element.descripcionFuncion,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })
        this.getFuncionesDeRol();
        //this.buscar()
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: error.error.responseCode.description,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })
      });
  }

}

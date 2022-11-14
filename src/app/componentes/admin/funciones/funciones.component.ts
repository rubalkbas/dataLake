import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import Swal from 'sweetalert2';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PerfilesService } from 'src/app/_services/perfiles.service';


const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}
/**
 * Clase de Funciones
 * @author MTP
 */
@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FuncionesComponent implements OnInit {

  data: any;

  displayedColumns: string[] = ['idFuncion', 'descripcionFuncion', 'acciones'];
  dataSource: any;
  selection = new SelectionModel<any>(true, []);


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
  public formEstatus: any;


  /**
  * Constructor
  */
  constructor(
    public formBuilder: FormBuilder,
    private paginator1: MatPaginatorIntl,
    private perfilesService: PerfilesService

  ) {
    this.paginator1.itemsPerPageLabel = "Registros por página";
    this.paginator1.getRangeLabel = dutchRangeLabel;
  };

  @ViewChild('TableOneSort', { static: true }) tableOneSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
  * On init
  */
  ngOnInit(): void {
    this.initForm();
    this.getFunciones();
  }

  /**
  * Metodo de validacion de caracteres
  */
  alfanumericoOnly(event): boolean {
    let inp = String.fromCharCode(event.keyCode);
    if (/^[a-z\d\-_\s]+$/i.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  /**
  * Metodo de validacion de formulario
  */
  initForm() {
    this.form = this.formBuilder.group({

      descripcionFuncion: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('[A-Za-z0-9 -]{1,60}')]],
    });
  }

  /**
  * Metodo de guardado de funcion
  */
  guardar() {

    if (this.form.value.descripcionFuncion === '') {
      this.form.setErrors({ 'invalid': true });
    } else {
      this.form.setErrors(null);
    }


    if (!this.form.valid) {
      Swal.fire({
        icon: 'warning',
        title: "Es necesario ingresar una descripcion.",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000

      })
    } else {

      this.perfilesService.crearFuncion(this.form.value).subscribe(
        data => {

          Swal.fire({
            icon: 'success',
            title: 'Se creo una nueva funcion.',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
          this.form.reset();
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key).setErrors(null);
          });
          this.getFunciones();

        },
        error => {
          Swal.fire({

            icon: 'error',
            title: 'Error, no se guardó el registro',
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
    * Metodo de edicion de la funcion
    */
  // actualizar(element) {
  //   if (element.status === 0) {
  //     element.status = 1;
  //   } else {
  //     element.status = 0;
  //   }

  //   this._adminService.actualizaFuncion(element).subscribe(data => {
  //     if (data.status === 'OK') {
  //       Swal.fire({
  //         icon: 'info',
  //         title: data.message,
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: data.status + ' :: ' + data.message,
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });
  //     }

  //   },
  //     error => {

  //     });
  // }
  actualizar(element) {

    this.formEstatus = {
      idFuncion: '',
      flgEstatus: '',
    };

    if (element.flgEstatus === 0) {
      element.flgEstatus = 1;
    } else {
      element.flgEstatus = 0;
    }


    this.formEstatus.idFuncion = element.idFuncion;
    this.formEstatus.flgEstatus = element.flgEstatus;
    // console.log(this.formEstatus);

    this.perfilesService.editarEstatusFuncion(this.formEstatus).subscribe(data => {

      Swal.fire({
        icon: 'info',
        title: 'Se actualizo el estatus correctamente',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      this.getFunciones();
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el estatus',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });

      });
  }

  /**
    * Metodo de listado de funciones
    */

  getFunciones() {
    this.perfilesService.obtenerFunciones().subscribe(
      data => {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = data.response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.tableOneSort;
      });
  }

  // getFunciones() {
  //   this._adminService.getFuncionesTodas().subscribe(data => {
  //     this.dataSource = new MatTableDataSource();
  //     this.dataSource.data = data.list;
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.tableOneSort;

  //   },
  //     error => {

  //     });
  // }



}

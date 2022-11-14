import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { PerfilesService } from "src/app/_services/perfiles.service";
import Swal from 'sweetalert2';
import { PopComponent } from '../pop/pop.component';
import { TokenStorageService } from "./../../../_services/token-storage.service";



const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 de ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

/**
 * Clase de Roles
 * @author MTP
 */

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})

export class RolesComponent implements OnInit {

  //Titulo pagina
  public breadcrumb: any;

  data: any;
  selected: any;
  displayedColumns: string[] = [
    "idRol",
    "rol",
    "desactivar",
    "actualizar"
  ];
  dataSource: any;
  selection = new SelectionModel<any>(false, []);
  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };

  options = {
    close: false,
    expand: true,
    minimize: true,
    reload: true,
  };



  temp = [];
  id: number;
  loadingIndicator: true;
  rows: any;
  editing = {};
  row: any;

  public form: FormGroup;
  public formEstatus: any;



  /**
  * Constructor
  */
  constructor(
    private perfilesService: PerfilesService,
    private paginator1: MatPaginatorIntl,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    private router: Router

  ) {

    this.paginator1.itemsPerPageLabel = "Registros por página";
    this.paginator1.getRangeLabel = dutchRangeLabel;

  }

  @ViewChild("TableOneSort", { static: true }) tableOneSort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * On init
   */

  ngOnInit(): void {
    this.initForm();
    this.getRoles();

    this.breadcrumb = {
      mainlabel: "Admin",
      links: [
        {
          name: "Roles",
          isLink: false,
          link: "#",
        },
      ],
    };
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
      // id: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('[A-Za-z0-9 -]{1,60}')]],
      //status: [''],
    });
  }

  /**
   * Metodo de listado de roles 
   */
  getRoles() {
    this.perfilesService.obtenerRoles().subscribe(
      data => {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = data.response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.tableOneSort;
      },
      error => {
        // This is intentional
      });
  }

  /**
   * Metodo de guardado de roles
   */
  guardar() {
    if (this.form.value.descripcion === '') {
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

      this.perfilesService.crearRol(this.form.value).subscribe(
        data => {

          Swal.fire({
            icon: 'success',
            title: 'Se creo un nuevo rol.',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
          this.form.reset();
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key).setErrors(null);
          });
          this.getRoles();

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

  limpiar() {
    this.initForm();
  }

  /**
   * Metodo de actualizacion de roles
   */
  actualizar(element) {
    let stat;
    this.formEstatus = {
      idRol: '',
      estatus: '',
    };

    if (element.estatus === 0) {
      element.estatus = 1;
      stat = 'Activado';
    } else {
      element.estatus = 0;
      stat = 'Desactivado';
    }


    this.formEstatus.idRol = element.idRol;
    this.formEstatus.estatus = element.estatus;
    // console.log(this.formEstatus);

    this.perfilesService.editarEstatusRol(this.formEstatus).subscribe(data => {

      Swal.fire({
        icon: 'info',
        title: 'se ha ' + stat + ' exitosamente el Rol: ' + data.response.descripcion,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      this.getRoles();
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

  /**
   * Metodo de complementario para la actualizacion de roles
   */
  actualizarRol(element) {
    const dialogRef = this.dialog.open(PopComponent, {
      width: "900px",
      height: "650px",
      data: element,

      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((usuario) => {
      // This is intentional
    });


  }


  highlight(row) {
    // This is intentional

  }



}

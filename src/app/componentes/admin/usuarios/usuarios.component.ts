import { SelectionModel } from "@angular/cdk/collections";
import { validateHorizontalPosition } from "@angular/cdk/overlay";
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
import { AdminService } from '../../../_services/admin.service';
import { EmpleadoRequestFilter } from "./../../../_bussines-model/empleado-request-filter";
import { TokenStorageService } from "./../../../_services/token-storage.service";

/**
 * Clase de Usuarios
 * @author MTP
 */

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

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent implements OnInit {

  //Titulo pagina
  public breadcrumb: any;

  data: any;
  selected: any;
  displayedColumns: string[] = [
    "codigoUsuario",
    "nombre",
    "descripcionRol",
    "acciones"
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
  roles: any = [];
  id: number;
  loadingIndicator: true;
  rows: any;
  editing = {};
  row: any;

  public form: FormGroup;
  public formSearch: FormGroup;
  public empleado: EmpleadoRequestFilter;
  public formEstatus: any;

  public show = false;
  public show2 = false;



  /**
   * Constructor
   */
  constructor(
    private perfilesService: PerfilesService,
    private paginator1: MatPaginatorIntl,
    private _adminService: AdminService,
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
    * Metodo de validacion de caracteres
    */
  alfanumericoOnly(event): boolean {
    let inp = String.fromCharCode(event.keyCode);
    if (/^[a-z\d\s]+$/i.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  alfanumericoOnly2(event): boolean {
    let inp = String.fromCharCode(event.keyCode);
    if (/^[a-zA-ZÀ-ÿ\u00f1\u00d1\d\s]+$/i.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  /**
     * On init
     */
  ngOnInit(): void {
    this.initForm();
    this.initFormSearch();
    this.getRoles();
    this.getUsuarios();

    this.breadcrumb = {
      mainlabel: "Admin",
      links: [
        {
          name: "Usuarios",
          isLink: false,
          link: "#",
        },
      ],
    };
  }

  /**
   * Metodo de iniciasion de formulario
   */
  initForm() {
    this.form = this.formBuilder.group({
      codigoUsuario: ["", [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      nombre: ["", [Validators.required, Validators.maxLength(50)]],
      correo: ["indracompany@cau.com"],//-VALOR DURO-checar dato de guardado
      idCentro: [212],//-VALOR DURO-checar dato de guardado
      idRol: [0, Validators.required],
      idGrupoResolutor: [981],//-VALOR DURO-checar dato de guardado
      Estatus: [1],

    });
  }
  /**
    * Metodo de iniciacion del formulario de busqueda
    */
  initFormSearch() {
    this.formSearch = this.formBuilder.group({
      codigoUsuario: [""],
      nombre: [""],
      idRol: [""],
    });
  }

  /**
 * Metodo de listado de roles 
 */
  getRoles() {
    this.perfilesService.obtenerRolesActivos().subscribe(
      data => {
        this.roles = data.response;
      },
      error => {
        // This is intentional
      });
  }

  /**
  * Metodo de consulta de usuarios
  */
  getUsuarios() {

    this.perfilesService.obtenerUsuarios().subscribe(
      data => {

        this.dataSource = new MatTableDataSource();
        this.dataSource.data = data.response;
        this.dataSource.sort = this.tableOneSort;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        // This is intentional
      });
  }

  /**
  * Metodo de guardado del usuario
  */


  valida(){
     
    if (this.form.value.codigoUsuario === '') {

      Swal.fire({
        icon: 'warning',
        title: "Falta ingresar un usuario.",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })

    } else if (this.form.value.nombre === '') {

      Swal.fire({
        icon: 'warning',
        title: "Falta ingresar un nombre de usuario",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })

    } else if (this.form.value.idRol === 0) {

      Swal.fire({
        icon: 'warning',
        title: "Falta ingresar un rol",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })

    }

  }
  guardar() {

    if (this.form.value.codigoUsuario !== '' && this.form.value.nombre !== '' && this.form.value.idRol !== 0) {
      if (this.form.value.codigoUsuario === ''
        || this.form.value.nombre === '' || this.form.value.idRol === '') {
        this.form.setErrors({ 'invalid': true });
      } else {
        this.form.setErrors(null);
      }
      if (!this.form.valid) {
        Swal.fire({
          icon: 'warning',
          title: "Es necesario ingresar todos los datos del usuario.",
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000

        })
      } else {
        // console.log(this.form.value);
        this.perfilesService.crearUsuario(this.form.value).subscribe(
          data => {

            Swal.fire({
              icon: 'success',
              title: 'Se guardo el usuario correctamente',
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: true,
              timer: 4000
            })
            this.form.reset();
            Object.keys(this.form.controls).forEach(key => {
              this.form.get(key).setErrors(null);
            });
            this.getUsuarios();
            this.limpiar();


          },
          error => {
            // console.log(error)
            let mensaje;
            Swal.fire({
              icon: 'error',
              title: mensaje,
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: true,
              timer: 4000
            })

          }
        );

      }
    }else{
      this.valida();
    }
  }

  /**
  * Metodo de busqueda de usuarios existentes
  */
  buscar() {
    if (this.formSearch.value.codigoUsuario === ''
      && this.formSearch.value.nombre === '' && this.formSearch.value.idRol === '') {
      this.formSearch.setErrors({ 'invalid': true });
    } else {
      this.formSearch.setErrors(null);
    }
    ;

    if (!this.formSearch.valid) {
      Swal.fire({
        icon: 'warning',
        title: "Es necesario ingresar un dato de busqueda.",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000

      })
    } else {
      let buscaUsuario = {
        "codigoUsuario": null,
        "nombre": null,
        "idRol": null
      }

      // console.log(this.formSearch.value);
      buscaUsuario = this.formSearch.value;
      // console.log(buscaUsuario);

      if (buscaUsuario.nombre == "") {
        buscaUsuario.nombre = null;
      }
      if (buscaUsuario.codigoUsuario == "") {
        buscaUsuario.codigoUsuario = null;
      }
      if (buscaUsuario.idRol == "") {
        buscaUsuario.idRol = null;
      }

      this.perfilesService.buscarUsuario(this.formSearch.value).subscribe(
        data => {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = data.response;
          this.dataSource.sort = this.tableOneSort;

          Swal.fire({
            icon: 'info',
            title: 'Consulta exitosa',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })


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
  * Metodo de limpieza del formulario
  */
  limpiar() {
    this.initFormSearch();
    this.getUsuarios();
  }


  /**
  * Metodode actualizacion de los usuarios
  */
  /**
   * Metodo de actualizacion de roles
   */
  actualizar(element) {

    // console.log(element);

    this.formEstatus = {
      codigoUsuario: '',
      flgEstatus: '',
    };

    if (element.flgEstatus == 0) {
      element.flgEstatus = 1;
    } else {
      element.flgEstatus = 0;
    }


    this.formEstatus.codigoUsuario = element.codigoUsuario;
    this.formEstatus.flgEstatus = element.flgEstatus;
    // console.log('esta')
    // console.log(this.formEstatus);

    this.perfilesService.editarEstatusUsuario(this.formEstatus).subscribe(data => {

      Swal.fire({
        icon: 'info',
        title: 'Se actualizo el estatus correctamente del usuario: ' + element.codigoUsuario,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      this.getUsuarios();
    },
      error => {
        Swal.fire({
          icon: 'error',
          title: error.error.responseCode.description,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });

      });
  }

  /**
  * Metodo de eliminacion de usuarios
  */
  eliminar(id) {
    // console.log(id);
    this.perfilesService.eliminarUusario(id).subscribe(
      data => {
        // console.log(data);
        Swal.fire({
          icon: 'info',
          title: 'Se elimino correctamente',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })
        this.getUsuarios();
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


import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AsuntosService } from "src/app/_services/asuntos.service";
import { ModelAsunto2 } from "src/app/models/asuntoModels/asunto2.model";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { subscribeOn } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

const FileSaver = require('file-saver');

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Registros por página:';
  customPaginatorIntl.getRangeLabel = dutchRangeLabel;


  return customPaginatorIntl;
}

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
  selector: 'app-alta-asunto',
  templateUrl: './detalleAsunto.component.html',
  styleUrls: ['./detalleAsunto.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class DetalleAsuntoComponent implements OnInit {
  @BlockUI('dropzoneGallery') blockUIDropzone: NgBlockUI;
  inputFormControl = new FormControl({ value: null, disabled: true });
  folio: any;
  public form: FormGroup;
  infoAsunto: any;
  formEdicion: any;
  editarAsunto = true;
  displayedColumns: string[] = ['nombreArchivo', 'descripcion', 'fechaAlta', 'idAnexoAsunto'];
  dataSource: any;
  displayedColumns2: string[] = ['nombreUrl', 'descripcion', 'fechaAlta', 'url'];
  dataSource2: any;
  displayedColumns3: string[] = ['nombreUsuario', 'descripcion', 'fechaAlta'];
  dataSource3: any;
  displayedColumns4: string[] = ['nombreUsuario', 'dscDetallada', 'fchModificacion'];
  dataSource4: any;
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginatorIntl;
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator;
  @ViewChild('TableThreePaginator', { static: true }) tableThreePaginator: MatPaginator;
  @ViewChild('TableFourPaginator', { static: true }) tableFourPaginator: MatPaginator;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private _activeRouter: ActivatedRoute,
    public asuntosService: AsuntosService,
    public formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this._activeRouter.params.subscribe((params: Params) => {
      this.folio = params.folio;
    });

    //// console.log('este es el folio:' + this.folio);
    this.detalleAsunto(this.folio);
    this.form = this.formBuilder.group({
      nombre: [''],
      telefono: [''],
      movil: [''],
      correo: [''],
      direccionContacto: ['', Validators.required],
      movilContacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      descripcionBreveAsunto: [''],
      fechaCreacion: [''],
      estadoAsunto: [''],
      motivoReapertura: [''],
      categoria: [''],
      centro: [''],
      telefonoCentro: [''],
      direccionCentro: [''],
      descripcionDetallada: [''],
      detalleHistorico: ['', Validators.required]

    });
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  detalleAsunto(folio) {
    this.asuntosService.detalleAsunto(folio).subscribe(data => {
      this.form.patchValue({
        'nombre': data.response.peticionario.nombre,
        'telefono': data.response.peticionario.telefonoUsuario,
        'movil': data.response.peticionario.movilUsuario,
        'correo': data.response.peticionario.correo,
        'direccionContacto': data.response.direccionContacto,
        'movilContacto': data.response.telefonoContacto,
        'descripcionBreveAsunto': data.response.dscBreve,
        'fechaCreacion': data.response.diaAlta,
        'estadoAsunto': data.response.descripcionEstado,
        'motivoReapertura': data.response.descripcionPrioridadCategoria,
        'categoria': data.response.categoriaDescripcionCategoria,
        'centro': data.response.centro.nombre,
        'telefonoCentro': data.response.centro.telefono,
        'direccionCentro': data.response.centro.calle + ', ' + data.response.centro.ciudad + ', ' + data.response.centro.cp,
        'descripcionDetallada': data.response.dscDetallada
      });
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data.response.anexosArchivos;
      this.dataSource.paginator = this.tableOnePaginator;
      this.dataSource2 = new MatTableDataSource();
      this.dataSource2.data = data.response.anexosUrl;
      this.dataSource2.paginator = this.tableTwoPaginator;
      this.dataSource3 = new MatTableDataSource();
      this.dataSource3.data = data.response.modificacionesAsunto;
      this.dataSource3.paginator = this.tableThreePaginator;
      this.dataSource4 = new MatTableDataSource();
      this.dataSource4.data = data.response.historicosAsuntos;
      this.dataSource4.paginator = this.tableFourPaginator;
      this.spinner.hide();
    });
    /*  Object.keys(this.form.controls).forEach(key => {
       this.form.get(key).setErrors(null);
     }); */
  }

  generaArchivo(id: any, archivo: any, extension: any) {
    // console.log('generaArchivo ini');
    let splitted: any[] = archivo.split(".");
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      didOpen: function () {
        Swal.showLoading();
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Descargando archivo...'
    });
    let tipoExt = '';
    let tipoFile = '';
    tipoExt = splitted[splitted.length - 1];
    tipoFile = extension;

    this.asuntosService.exportaArchivo(id).subscribe(response => {
      this.downLoadFile(response, archivo, tipoFile);
    },
      (error) => {
        // This is intentional
      });
    // console.log('generaArchivo fin');
  }

  downLoadFile(data: any, archivo: string, typeFile: string) {
    let binaryData = [];
    if (data === null || data === undefined) {
      Swal.close(); // Cierra la ventana de espera
      Swal.fire({
        icon: "warning",
        title: "No hay datos para este reporte",
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else {
      binaryData.push(data);
      const blobValue = new Blob(binaryData, {
        type: typeFile
      });
      FileSaver.saveAs(blobValue, archivo);
      Swal.close(); // Cierra la ventana de espera
    }
  }

  habilitarEdicion(value) {
    if (value === 1) {
      this.editarAsunto = false;
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Se pueden editar los datos',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })
    } else if (value === 0) {
      this.editarAsunto = true;
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Se cancela la edicion',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })
    }
  }
  guardarEdicion(value) {
    if (value === 1) {
      this.editarAsunto = false;
    } else if (value === 0) {
      this.editarAsunto = true;
    }
  }

  modificarAsuntoPeticionario() {

    this.formEdicion = {
      idAsunto: '',
      dscDetallada: '',
      direccionContacto: '',
      telefonoContacto: '',
      idPrioridadPeticionario: 1,
      modificaciones: ''
    }

    this.formEdicion.idAsunto = this.folio;
    this.formEdicion.dscDetallada = this.form.value.detalleHistorico;
    this.formEdicion.direccionContacto = this.form.value.direccionContacto;
    this.formEdicion.telefonoContacto = this.form.value.movilContacto;
    //this.formEdicion.idPrioridadPeticionario = this.form.value.
    this.formEdicion.modificaciones = 'Se actualiza la información de asunto por el usuario';

    if (this.form.valid) {
      this.asuntosService.modificarAsuntoPeticionario(this.formEdicion).subscribe(
        data => {
          //this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se Edito El Asunto Con Exito',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
          this.detalleAsunto(this.folio);
          this.form.patchValue({
            'detalleHistorico': ''
          });
          Object.keys(this.form.controls).forEach(key => {
            this.form.get(key).setErrors(null);
          });
          this.guardarEdicion(0);
        },
        err => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: err.error.responseCode.message,
            text: err.error.responseCode.moreInfo,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          })
        }
      );
    } else {
      if (!this.form.value.detalleHistorico) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Información en el campo Detalle!',
          text: 'Favor De validar!',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })


      } else if (!this.form.value.movilContacto) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Información en el campo Movil!',
          text: 'Favor De validar!',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })

      } else if (!this.form.value.direccionContacto) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Información en el campo Dirección!',
          text: 'Favor De validar!',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        })

      }

    }
  }
  salirBoton() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/portalSoluciones/alertas']));
  }

}


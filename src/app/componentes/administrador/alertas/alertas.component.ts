
import { ThisReceiver } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NotificacionesService } from "src/app/_services/notificaciones.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import Swal from "sweetalert2";


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
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {
  displayedColumns: string[] = ['folioAsunto', 'descripcion', 'fechaAlta', 'opciones'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginatorIntl;

  notificacionesLista: any;
  currentUser: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private spinner: NgxSpinnerService,
    private notificacionesService: NotificacionesService,
    private paginator1: MatPaginatorIntl,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {

    this.paginator1.itemsPerPageLabel = "Registros por página";
    this.paginator1.getRangeLabel = dutchRangeLabel;

  }


  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    // console.log( this.currentUser);
    this.spinner.show();
    this.traerNotificaciones(this.currentUser.usuario);
    this.spinner.hide();
  }

  traerNotificaciones(user) {
    this.notificacionesService.traerNotifNoLeidasUsuario(user).subscribe(data => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data.response;
      this.dataSource.paginator = this.paginator;
    });
  }

  oprimir(opcion) {
    Swal.fire({
      icon: 'success',
      title: opcion,
      showConfirmButton: false,
      timer: 2000,

    });
  }

  oprimirConDatos(opcion) {
    Swal.fire({
      title: 'Breve descripción',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Solucionar',
      confirmButtonColor: '#f44336',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        // This is intentional
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      // This is intentional

    });
  }

  detalleAlerta(folio,idNoti) {
    this.notificacionesService.leerNotificacion(idNoti).subscribe(data => {
      
      // console.log('Se cambio el status');
      this.traerNotificaciones(this.currentUser.usuario);
      this.router.navigate(['/portalSoluciones/detalleAsunto/'+ folio ])

    });

     
  }

 

}
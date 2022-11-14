
import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from "ngx-perfect-scrollbar";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ApplicationApiService } from "src/app/_services/application-api.service";
import Swal from "sweetalert2";
import { AutoAyudaService } from "src/app/_services/autoAyuda.service"
import { ModelEncuesta } from "src/app/models/autoayudaModel/EncuestaSatisfaccion.model";
import { ModelPregunta } from "src/app/models/autoayudaModel/preguntaModel.model";
import { ModelAnexo } from "src/app/models/autoayudaModel/anexosModel.model";
import { ModelAnexoUrl } from "src/app/models/autoayudaModel/anexosUrlModel.model";
import { ModelUrls } from "src/app/models/asuntoModels/urlsAsunto.model";
import { Router } from "@angular/router";
import { AsuntosService } from "src/app/_services/asuntos.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TokenStorageService } from "src/app/_services/token-storage.service";

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

export interface PeriodicElement {
  numero: string;
  fecha: string;
  resolutor: string;
  estado: string;
  centro: string;
  categoria: string;
}

const ELEMENT_DATA2: PeriodicElement[] = [
  { numero: '1', fecha: 'EJEMPLO DE TEMA', resolutor: 'PREGUNTA', estado: 'LINK 1', centro: 'ejemplo de Accion', categoria: 'Categoria 1' },
  { numero: '1', fecha: 'EJEMPLO DE TEMA', resolutor: 'RESPUESTA', estado: 'Estatus 1', centro: 'ejemplo de Accion', categoria: 'Categoria 1' }


];
class Email {
  constructor(
    public emailId: number,
    public mediaClass: string,
    public starClass: string,
    public starIcon: string,
    public image: any,
    public time: string,
    public title: string,
    public message: string,
    public message2: string,
    public message3: string,
    public message4: string,
    public showicon: boolean,
    public bullet: string,

  ) { }
}

class EmailHistory {
  constructor(
    public emailId: number,
    public username: string,
    public email: string,
    public image: any,
    public date: any,
    public title: string,
    public message: string,
    public descrition: string,
    public descrition_detail: string,
    public sender: string,
    public sender_name: string,
    public iconClass: string,
    public image_icon1: string,
    public file_name1: string,
    public image_icon2: string,
    public file_name2: string
  ) { }
}
class EmailMenu {
  constructor(
    public Id: string,
    public name: string,
    public icon: string,
    public budge: string,
    public budgeClass: string,
    public budgeIcon: boolean,
    public isSelected: false
  ) { }
}
class EmailLable {
  constructor(
    public Id: string,
    public name: string,
    public isSelected: boolean,
    public bulletClass: string,
  ) { }
}

export interface Calificacion {
  calif: string;
}


@Component({
  selector: 'app-auto-ayuda',
  templateUrl: './auto-ayuda.component.html',
  styleUrls: ['./auto-ayuda.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class AutoAyudaComponent implements OnInit {

  displayedColumns: string[] = ['id', 'descripcion', 'descarga'];
  dataSource: any;
  displayedColumns2: string[] = ['id', 'descripcion', 'txtUrl', 'dscDetll'];
  dataSource2: any;
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginatorIntl;
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginatorIntl;

  calificacionData: Calificacion[] = [
    { calif: 'Muy Mala' },
    { calif: 'Mala' },
    { calif: 'Regular' },
    { calif: 'Bien' },
    { calif: 'Muy Bien' }
  ];

  calificacion = '';

  formEncuesta: ModelEncuesta = {};

  @ViewChild(MatAccordion) accordion: MatAccordion;
  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };
  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  directiveRef?: PerfectScrollbarDirective;
  @ViewChild(PerfectScrollbarDirective, { static: true })
  ejemplo: any = ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"];
  newSteps: any;


  //Lista de autoAyuda
  autoAyudaList: any[] = [];
  idCategoria = 0;
  autoAyudaListD: any[] = [];

  preguntasArray: Array<ModelPregunta> = [];
  anexosArray: Array<ModelAnexo> = [];
  anexosUrlArray: Array<ModelAnexoUrl> = [];
  idPreguntaEncuesta: any;
  isHidden = false;
  isShown = true;
  emailList: any[] = [];
  emailDisplayList: any[] = [];
  emailMenuList: any[] = [];
  email: EmailHistory[];
  emailLable: EmailLable[];
  emailArray: any;
  temp = [];
  temp2 = this.emailList;
  isSelected: boolean;
  isCollapsed = false;
  selectAll = false;
  selected: [];
  blured = false;
  focused = false;
  hide = false;
  htmlText = 'Type Something';
  form: FormGroup;
  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' }
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ];
  quillConfig = {
    toolbar: '.toolbar1',
    autoLink: true,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            // console.log('enter');
            return true;
          }
        }
      }
    }
  };
  emailquillConfig = {
    toolbar: '.toolbar',
    autoLink: true
  };

  /**
   * Constructor
   *
   * @param ApplicationApiService     emailApiService
   * @param Renderer2                 renderer
   */

  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalAsuntos: any;
  paginaActual: any;
  cuantos: any;
  cuantosDe: any;
  idCategoriaSeleccionada: any;
  buscarInput: string;
  nombreCategoria: any;
  constructor(
    private tokenStorageService: TokenStorageService,
    private spinner: NgxSpinnerService,
    public asuntosService: AsuntosService,
    public formBuilder: FormBuilder,
    private autoAyudaService: AutoAyudaService,
    private renderer: Renderer2,
    private router: Router,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      editor: ['']
    });
  }
  openGroup(e) {
    // console.log(e);
  }
  /**
   * OnInit
   */
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

  traerTodo() {
    this.autoAyudaService.traerAutoAyudaTodo().subscribe(data => {
      //console.log(data);
      this.autoAyudaList = data.response;
      // this.totalAsuntos = data.response.totalElements;
      // this.paginaActual = data.response.pageable.pageNumber;
      // this.cuantos = data.response.pageable.offset + 1;
      // this.cuantosDe = this.cuantos + 9;
      // if (this.cuantosDe > this.totalAsuntos) {
      //   this.cuantosDe = this.totalAsuntos;
      // }
      this.temp2 = this.autoAyudaList;
    });
  }

  proximoPage() {
    this.paginaActual = this.paginaActual + 1;
    if (this.paginaActual * 10 < this.totalAsuntos) {

      this.traerTodo();
    } else {
      this.paginaActual = this.paginaActual - 1;
    }
  }

  antPage() {
    if (this.paginaActual > 0) {
      this.paginaActual = this.paginaActual - 1;
      this.traerTodo();
    }
  }

  ngOnInit() {
    this.idPreguntaEncuesta = 0;
    //this.cargarAnexos(1);//VALOR DURO DE TEST
    this.traerTodo();
    this.form = this.formBuilder.group({
      calif: [''],
    });
    this.form
      .controls
      .editor
      .valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((data) => {
        // This is intentional
      });
  }

  guardarEncuesta() {
    if (this.idPreguntaEncuesta === 0) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Necesitas Seleccionar Una Pregunta!',
        text: 'Con solo dar clic en el botón "Mostrar Anexos" se selecciona en automático',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else {
      if (this.calificacion !== '') {
        this.formEncuesta = {
          encuesta: [{
            idPregunta: this.idPreguntaEncuesta,
            respuesta: this.calificacion
          }],
          codigoUsuario: ''
        };
        this.formEncuesta.codigoUsuario = this.tokenStorageService.getUserName();//VALOR DURO DE TEST
        this.autoAyudaService.crearEncuestaSatisfaccion(this.formEncuesta).subscribe(
          data => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Se Registro Tu Respuesta Con Exito',
              showConfirmButton: false,
              showCancelButton: false,
              showCloseButton: true,
              timer: 4000
            });
            this.form.reset();
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/portalSoluciones/autoAyuda']));

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
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Necesitas Seleccionar Una Calificacion!',
          text: 'Selecciona una calificacion',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      }
      
    }

  }

  check(event, opt, userResponse) {
    if (event.checked === true) {
      userResponse.push(opt);
    }
    if (event.checked === false) {
      let index: number = userResponse.indexOf(opt);
      userResponse.splice(index, 1);
    }
    this.calificacion = opt;
  }

  /**
 * Search email
 *
 * @param event     Convert value uppercase to lowercase;
 */
  updateFilter(event) {
    const value = event.target.value.toLowerCase();
    this.autoAyudaList = [...this.temp2]; // and here you have to initialize it with your data
    this.temp = [...this.autoAyudaList];
    // filter our data
    const temp = this.autoAyudaList.filter(function (d) {
      return d.grlPreg.toLowerCase().indexOf(value) !== -1 || !value;
    });
    // update the rows
    this.autoAyudaList = temp;
    // Whenever the filter changes, always go back to the first page
  }
  /**
   * Overlay add/remove fuction in responsive
   *
   * @param event     Overlay click event
   */
  contentOverlay(event) {
    const toggleIcon = document.getElementById('email-app-menu');
    const toggle = document.getElementById('content-overlay');
    if (event.currentTarget.className === 'content-overlay show') {
      this.renderer.removeClass(toggleIcon, 'show');
      this.renderer.removeClass(toggle, 'show');
    }
  }

  /**
   * Add overlay when open sidebar
   *
   * @param event     Content overlay
   */
  contentRightSidebar(event) {
    const toggle = document.getElementById('content-right');
    if (event.currentTarget.className === 'media _media border-0 ng-star-inserted active') {
      this.renderer.addClass(toggle, 'show');
    }
  }

  /**
   * Remove overlay when close sidebar
   *
   * @param event     Content overlay
   */
  contentRight(event) {
    const toggle = document.getElementById('content-right');
    if (event.currentTarget.className === 'btn btn-primary go-back') {
      this.renderer.removeClass(toggle, 'show');
    }
  }
  /**
   * Open Media-body
   *
   * @param event   Mail Read
   */
  showEmail2(event, categoria) {
    this.idCategoriaSeleccionada = categoria;
    
    this.traerPorId(categoria);
    const toggleIcon = document.getElementById('app-details');
    if (event.currentTarget.className === 'mat-focus-indicator btn-block active espacio mat-raised-button mat-button-base mat-warn cdk-focused cdk-mouse-focused') {
      this.renderer.addClass(toggleIcon, 'show');
    } else if (event.currentTarget.className === 'ficon feather ft-chevron-left font-medium-4 align-middle') {
      this.renderer.removeClass(toggleIcon, 'show');
    }

  }

  showEmail(event) {
    const toggleIcon = document.getElementById('app-details');
    if (event.currentTarget.className === 'mat-focus-indicator btn-block active espacio mat-raised-button mat-button-base mat-warn cdk-focused cdk-mouse-focused') {
      this.renderer.addClass(toggleIcon, 'show');
    } else if (event.currentTarget.className === 'ficon feather ft-chevron-left font-medium-4 align-middle') {
      this.renderer.removeClass(toggleIcon, 'show');
    }
  }
  /**
   *
   * @'param' event
   * @'param' emailId
   */
  showMassage(event, emailId) {
    if (emailId === 1) {
      const toggleIcon = document.getElementById('headingCollapse5');
      const toggle = document.getElementById('collapse5');
      const toggleHeader = document.getElementById('emailThread');
      if (event.currentTarget.className === 'card collapse-header ng-star-inserted') {
        this.renderer.addClass(toggle, 'show');
        this.renderer.addClass(toggleHeader, 'open');
        this.renderer.removeClass(toggleIcon, 'collapsed');
        this.emailDisplayList[0].isCollapsed = true;
      } else if (event.currentTarget.className === 'card collapse-header ng-star-inserted open') {
        this.renderer.removeClass(toggle, 'show');
        this.renderer.removeClass(toggleHeader, 'open');
        this.renderer.addClass(toggleIcon, 'collapsed');
        this.emailDisplayList[0].isCollapsed = false;
      }
    }
  }
  /**
  * Add overlay when open sidebar
  *
  * @param event    Content overlay
  */
  showComposeSidebar(event) {
    const toggleIcon = document.getElementById('compose-sidebar');
    const toggleSidebar = document.getElementById('sidebar-left');
    const toggleOverlay = document.getElementById('app-content-overlay');
    if (event.currentTarget.className === 'btn btn-danger btn-glow btn-block my-2 compose-btn') {
      this.renderer.addClass(toggleIcon, 'show');
      this.renderer.removeClass(toggleSidebar, 'show');
      this.renderer.addClass(toggleOverlay, 'show');
    } else if (event.currentTarget.className === 'btn btn-danger btn-glow btn-block my-2 compose-btn show') {
      this.renderer.removeClass(toggleIcon, 'show');
    }
  }
  /**
  * Remove overlay when open sidebar
  *
  * @param event    Content overlay
  */
  showCompose(event) {
    const toggleIcon = document.getElementById('compose-sidebar');
    const toggleOverlay = document.getElementById('app-content-overlay');
    if (event.currentTarget.className === 'close close-icon' || 'app-content-overlay') {
      this.renderer.removeClass(toggleIcon, 'show');
      this.renderer.removeClass(toggleOverlay, 'show');
    }
  }
  /**
 * Add overlay when open sidebar
 *
 * @param event     Content overlay
 */
  showSidebar(event) {
    const toggleIcon = document.getElementById('sidebar-left');
    const toggle = document.getElementById('app-content-overlay');
    if (event.currentTarget.className === 'sidebar-toggle d-block d-lg-none') {
      this.renderer.addClass(toggleIcon, 'show');
      this.renderer.addClass(toggle, 'show');
    } else if (event.currentTarget.className === 'sidebar-close-icon' || 'app-content-overlay') {
      this.renderer.removeClass(toggleIcon, 'show');
      this.renderer.removeClass(toggle, 'show');
    }
  }

  onKeydown(event) {

    // console.log(this.buscarInput)
    this.buscarInput = '';
  }

  
  /**
   * Filter Email
   *
   * @param term    search term
   */
  search(term) {
    const searchTerm = term.currentTarget.value;
    if (searchTerm !== '') {
      this.autoAyudaList = this.autoAyudaList.filter(result => {
        if (result && searchTerm) {
          if (result.grlPreg.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            result.grlResp.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            result.categoriaPadre.dscBreveCateg.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    } else {
      this.autoAyudaList = this.temp2;
    }
  }

  selectAllEmails() {
    for (let i = 0; i < this.autoAyudaList.length; i++) {
      if (this.selectAll) {
        this.autoAyudaList[i].isSelected = false;
      } else {
        this.autoAyudaList[i].isSelected = true;
      }
    }
  }

  deleteCheckedRow() {
    let index = 0;
    const removedIndex = [];
    const temp = [...this.autoAyudaList];
    for (const row of temp) {
      if (row.isSelected === true) {
        removedIndex.push(index);
      }
      index++;
    }
    for (let i = removedIndex.length - 1; i >= 0; i--) {
      temp.splice(removedIndex[i], 1);
    }
    this.autoAyudaList = temp;
    this.selectAll = false;
  }

  focus() {
    this.focused = true;
    this.blured = false;
  }

  blur() {
    this.focused = false;
    this.blured = true;
  }

  setControl() {
    this.form.setControl('editor', new FormControl('test - new Control'));
  }
  /**
  * Filter Email
  *
  * @ param event   warning Class
  * @ param emailId
  */
  emailFavorite(event, emailId) {
    for (let i = 1; i <= this.emailDisplayList.length; i++) {
      if (emailId === i) {
        const emailIcon = document.getElementById('email-icon' + emailId);
        const emailstarIcon = document.getElementById('emailstar-icon' + emailId);
        if (event.currentTarget.className === 'favorite') {
          this.renderer.addClass(emailIcon, 'warning');
          this.renderer.addClass(emailstarIcon, 'warning');
        } else if (event.currentTarget.className === 'favorite warning') {
          this.renderer.removeClass(emailIcon, 'warning');
          this.renderer.removeClass(emailstarIcon, 'warning');
        }
      }
    }
  }

  traerPorId(categoria) {
    //this.spinner.show();
    this.idCategoria = categoria;
    this.autoAyudaService.traerAutoAyudaPorId(this.idCategoria).subscribe(data => {
      this.preguntasArray = [];
      this.anexosArray = [];
      this.anexosUrlArray = [];
      data.response.content.forEach(datax => {
        let preguntaA = new ModelPregunta();
        preguntaA.grlPreg = datax.pregunta.grlPreg;
        preguntaA.grlResp = datax.pregunta.grlResp;

        this.nombreCategoria  =  datax.pregunta.categoriaPadre.dscBreveCateg
        preguntaA.id = datax.pregunta.id;
        this.preguntasArray.push(preguntaA);
        datax.anexos.forEach(dataAnexos => {
          let anexosA = new ModelAnexo();
          anexosA.id = dataAnexos.id;
          anexosA.descripcion = dataAnexos.descripcion;
          anexosA.grlExtArchAnexo = dataAnexos.grlExtArchAnexo
          anexosA.idPregRelCateg = dataAnexos.idPregRelCateg
          this.anexosArray.push(anexosA);
        });
        datax.anexosUrl.forEach(dataAnexosUrl => {
          let anexosUrlA = new ModelAnexoUrl();
          anexosUrlA.id = dataAnexosUrl.id;
          anexosUrlA.descripcion = dataAnexosUrl.descripcion;
          anexosUrlA.txtUrl = dataAnexosUrl.txtUrl;
          anexosUrlA.dscDetll = dataAnexosUrl.dscDetll;
          anexosUrlA.idPregRelCateg = dataAnexosUrl.idPregRelCateg
          this.anexosUrlArray.push(anexosUrlA);
        });
      });
    });
    //this.spinner.hide();
  }

  cargarAnexos(id) {
    this.idPreguntaEncuesta = id;
    let anexoTabla = new Array<ModelAnexo>;
    this.anexosArray.forEach(data => {
      if (data.idPregRelCateg == id) {
        anexoTabla.push(data);
      }
    })
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = anexoTabla;
    this.dataSource.paginator = this.tableOnePaginator;

    let anexoUrl = new Array<ModelUrls>;
    this.anexosUrlArray.forEach(data => {
      if (data.idPregRelCateg == id) {
        anexoUrl.push(data);
      }
    })
    this.dataSource2 = new MatTableDataSource();
    this.dataSource2.data = anexoUrl;
    this.dataSource2.paginator = this.tableTwoPaginator;
  }

  crearAsuntoBoton() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/portalSoluciones/altaAsunto/' + this.idCategoriaSeleccionada + ':' + this.nombreCategoria]));
  }

  limpiarDataTable() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource2 = new MatTableDataSource();
    this.dataSource2.paginator = this.tableTwoPaginator;
  }

  // descargarArchivoAnexado(idAnexo){
  //   this.autoAyudaService.descargarAnexoAutoAyuda(idAnexo).subscribe(data => {
  //     // console.log('si entra');
  //   });
  // }

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

    this.autoAyudaService.descargarAnexoAutoAyuda(id).subscribe(response => {
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

}



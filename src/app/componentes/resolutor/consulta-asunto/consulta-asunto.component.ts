import { DatePipe } from '@angular/common';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AsyncSubject, Observable } from "rxjs";
 
import moment from 'moment';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ModelArchivo } from 'src/app/models/asuntoModels/archivosAsunto.model';
import { ModelUrls } from 'src/app/models/asuntoModels/urlsAsunto.model';
import { CondicionesModel, CriteriosModel } from 'src/app/_bussines-model/criterios-model';
import { GuardaCriteriosModel } from 'src/app/_bussines-model/guardaCriteriosModel';
import { ApplicationApiService } from 'src/app/_services/application-api.service';
import { AsuntosService } from 'src/app/_services/asuntos.service';
import { BusquedasService } from 'src/app/_services/busquedas.service';
import { CategoriasService } from 'src/app/_services/categorias.services';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { ServicioCompartido } from 'src/app/_services/servicioCompartido.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from "sweetalert2";
import { SelectedFiles } from '../../administrador/asunto/altaAsunto/altaAsunto.component';

const FileSaver = require('file-saver');

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Registros por página:';
  customPaginatorIntl.getRangeLabel = dutchRangeLabel;


  return customPaginatorIntl;
}

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

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY-MM-DD"
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "YYYY-MM-DD",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
const reg = '(https?://.*)';
@Component({
  selector: 'app-consulta-asunto',
  templateUrl: './consulta-asunto.component.html',
  styleUrls: ['./consulta-asunto.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator(), },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]
})
export class ConsultaAsuntoComponent implements OnInit {
  public effectiveDateFrom = new Date();
  public effectiveDateFrom2 = new Date();
  listaUrls: Array<ModelUrls> = [];
  public selectedFiles: SelectedFiles[] = [];

  formPeticioInfo: any;
  formSolucionAsunto: any;
  public statusAsunto: any;
  date = new FormControl(moment());
  date2 = new FormControl(moment());
  idAsuntoSeleccionado: any;
  formReservar: any;
  folio: any;
  formDetalle: FormGroup;
  formCriterio: FormGroup;
  todosAsuntos: any[] = [];
  idDummy: any = 10000000
  step1 = 0;
  mostrar: boolean = true;
  public currentUser: any;
  step2 = 0;
  mostrar2: boolean = true;
  guardaCriterios: GuardaCriteriosModel;
  solicitarInfoDeta = true;
  solucionarInfo = true;
  catalogoClasificacion: any;
  catalogoPrioridad: any;
  validaInputs: string = '';
  archivosArray: Array<ModelArchivo> = [];

  files: File[] = [];



  @ViewChild(MatAccordion) accordion: MatAccordion;
  public config: PerfectScrollbarConfigInterface = { wheelPropagation: true };
  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  directiveRef?: PerfectScrollbarDirective;
  @ViewChild(PerfectScrollbarDirective, { static: true })
  ejemplo: any = ["Ejemplo 1", "Ejemplo 2", "Ejemplo 3"];
  newSteps: any;


  isHidden = false;
  isShown = true;
  emailList: any[] = [];
  emailDisplayList: any[] = [];
  emailMenuList: any[] = [];
  email: EmailHistory[];
  emailLable: EmailLable[];
  emailArray: any;
  temp = [];
  temp2 = this.todosAsuntos;
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
  // displayedColumns: string[] = ['numero', 'fecha', 'resolutor', 'estado', 'centro', 'categoria'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA2);

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
  criterios: CriteriosModel[];
  selectCriterios: any;
  citerioSeleccionado: CriteriosModel;
  valorCrit: any = '';
  operadorLogico: string;
  filtroSeleccionado: string;
  comboCriterios: any;
  totalAsuntos: any;
  paginaActual: any;
  cuantos: any;
  cuantosDe: any;
  idFiltroSeleccionado: any;
  criterioComboSeleccionado: any;
  condiciones3: Array<CondicionesModel>;
  condiciones4: Array<CondicionesModel>;
  condiciones5: Array<CondicionesModel>;
  condiciones6: Array<CondicionesModel>;
  condiciones7: Array<CondicionesModel>;
  condiciones8: Array<CondicionesModel>;

  estanFiltrados: boolean = false;
  buscarInput: any;
  fechaSleccionada: any;
  todayDate: Date = new Date();
  nameCriterio: string;
  constructor(
    private router: Router,
    private perfilesService: PerfilesService,
    private tokenStorageService: TokenStorageService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    public asuntosService: AsuntosService,
    public busquedasService: BusquedasService,
    public formBuilder: FormBuilder,
    private categoriasService: CategoriasService,
    fb: FormBuilder,
    private servicioCompartido: ServicioCompartido
  ) {
    this.form = fb.group({
      editor: ['']
    });
  }

  clickMe() {
    this.servicioCompartido.sendClickEvent();
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
  ngOnInit() {
    this.operadorLogico = '';
    this.getClasificacionResolutor();
    this.getPrioridades();
    //this.spinner.show();
    this.obtenerUsuarioByCodigo(this.tokenStorageService.getUserName());
    this.consultaTodosAsuntos('0');
    this.consultaCriteriosId(this.tokenStorageService.getUserName());
    this.criterios = [];
    this.condiciones3 = new Array<CondicionesModel>;
    this.condiciones4 = new Array<CondicionesModel>;
    this.condiciones5 = new Array<CondicionesModel>;
    this.condiciones6 = new Array<CondicionesModel>;
    this.condiciones7 = new Array<CondicionesModel>;
    this.condiciones8 = new Array<CondicionesModel>;
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

    this.formDetalle = this.formBuilder.group({
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
      detalleHistorico: [''],
      detalleHistoricoSolucion: [''],
      idClasificacion: [''],
      idPrioridad: [''],
      nombreUrl: [''],
      url: ['', [Validators.maxLength(300), Validators.pattern(reg)]],
      descripcionUrl: [''],
      archivos: this.archivosArray,
      urls: this.listaUrls,

    });
    this.formCriterio = this.formBuilder.group({
      tipoBusqueda: ['',],
      descCriterio: [''],
      condicion: [''],
      condicion2: [''],
      date: [''],
      date2: [''],
    });



  }

  // Metodos de consulta inicio

  consultaTodosAsuntos(page) {
    this.busquedasService.traerTodosAsuntos(page).subscribe(data => {
      this.todosAsuntos = data.response.content;
      this.totalAsuntos = data.response.totalElements;
      this.paginaActual = data.response.pageable.pageNumber;
      this.cuantos = data.response.pageable.offset + 1;
      this.cuantosDe = this.cuantos + 9;

      if (this.cuantosDe > this.totalAsuntos) {
        this.cuantosDe = this.totalAsuntos;
      }
      this.temp2 = this.todosAsuntos;
      // console.log(this.todosAsuntos);
      //this.spinner.hide();
    });

  }
  proximoPage() {
    this.paginaActual = this.paginaActual + 1;
    if (this.paginaActual * 10 < this.totalAsuntos) {
      if (this.estanFiltrados) {
        this.buscaPorCriterios(this.paginaActual);
      } else {
        this.consultaTodosAsuntos(this.paginaActual);
      }
    } else {
      this.paginaActual = this.paginaActual - 1;
    }
  }


  antPage() {
    if (this.paginaActual > 0) {
      this.paginaActual = this.paginaActual - 1;
      if (this.estanFiltrados) {

        this.buscaPorCriterios(this.paginaActual);
      } else {
        this.consultaTodosAsuntos(this.paginaActual);
      }
    }
  }


  consultaCriteriosId(idUsuario) {
    this.busquedasService.consultarCrteriosId(idUsuario).subscribe(data => {
      this.comboCriterios = [];
      this.comboCriterios = data.response;
      //this.selectCriterios = data.response[0].busqueda.criterios;
      //this.criterios = data.response[0].busqueda.criterios;
      this.idDummy = this.criterios.length + 1;
      // console.log(" esto es lo que llega de criterios")

      // console.log(this.criterios)

    })

  }

  selectOperador(event: MatSelectChange) {

    this.operadorLogico = event.source.triggerValue;
    if (this.validaInputs !== 'FILTRO 1') {

      if (this.operadorLogico == 'está entre') {
        this.validaInputs = "FILTRO 3"


      } else {
        this.validaInputs = "FILTRO 2"
      }


    }


    // console.log(this.operadorLogico);
  }
  selectedValue(event: MatSelectChange) {

    this.filtroSeleccionado = event.source.triggerValue;
    this.idFiltroSeleccionado = event.source.value;
    this.formCriterio.controls['descCriterio'].clearValidators();
    this.formCriterio.controls['condicion'].clearValidators();
    this.formCriterio.controls['condicion2'].clearValidators();
    this.formCriterio.controls['date'].clearValidators();
    this.formCriterio.controls['date2'].clearValidators();
    this.formCriterio.controls['descCriterio'].updateValueAndValidity();
    this.formCriterio.controls['condicion'].updateValueAndValidity();
    this.formCriterio.controls['condicion2'].updateValueAndValidity();
    this.formCriterio.controls['date'].updateValueAndValidity();
    this.formCriterio.controls['date2'].updateValueAndValidity();



    if (this.idFiltroSeleccionado.toString() === '5' || this.idFiltroSeleccionado.toString() === '6' || this.idFiltroSeleccionado.toString() === '7' || this.idFiltroSeleccionado.toString() === '8') {

      this.validaInputs = 'FILTRO 1';

    }
    else {

      this.validaInputs = 'FILTRO 2';


    }



  }
  cambioCombo(event: MatSelectChange) {
    let idCriterio = event.value;
    this.nameCriterio = event.source.triggerValue;
    this.criterioComboSeleccionado = event.value;

    let index = this.comboCriterios.findIndex(x => x.id === idCriterio);
    this.criterios = [];
    this.criterios = this.comboCriterios[index].busqueda.criterios;
    this.comboCriterios[index].busqueda.criterios.forEach(data => {

      if (data.id == '5') {

        this.condiciones5 = [];
        this.condiciones5 = data.condiciones;
      } else if (data.id == '3') {
        this.condiciones3 = [];
        this.condiciones3 = data.condiciones;

      } else if (data.id == '4') {
        this.condiciones4 = [];
        this.condiciones4 = data.condiciones;

      } else if (data.id == '6') {
        this.condiciones6 = [];
        this.condiciones6 = data.condiciones;

      } else if (data.id == '7') {
        this.condiciones7 = [];
        this.condiciones7 = data.condiciones;

      } else if (data.id == '8') {
        this.condiciones8 = [];
        this.condiciones8 = data.condiciones;

      }

    })
    this.formCriterio.reset();
    Object.keys(this.formCriterio.controls).forEach(key => {
      this.formCriterio.get(key).setErrors(null);
    });
    //// console.log(this.filtroSeleccionado);
    this.buscaPorCriterios(0);
  }
  buscaPorCriterios(pagina: any) {
    this.estanFiltrados = true;
    let request: any = {
      'codUsr': this.tokenStorageService.getUserName(),
      'codCentro': "212",
      'criterios': this.criterios
    };
    // console.log(this.criterios)
    this.busquedasService.busquedaFiltradaPeticionario(pagina, request).subscribe(data => {
      this.todosAsuntos = data.response.content;
      this.totalAsuntos = data.response.totalElements;
      this.paginaActual = data.response.pageable.pageNumber;
      this.cuantos = data.response.pageable.offset + 1;
      this.cuantosDe = this.cuantos + 9;

      if (this.cuantosDe > this.totalAsuntos) {
        this.cuantosDe = this.totalAsuntos;

      }

      this.temp2 = this.todosAsuntos;
      // console.log(this.todosAsuntos);
      //this.spinner.hide();
    },
      err => {
        this.todosAsuntos = [];
        Swal.fire({
          icon: "warning",
          title: "No se encontraron registros para los filtros seleccionados",
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,

          timer: 8000,
        });

      });
  }


  agregaFiltro(): void {



    switch (this.validaInputs) {
      case "FILTRO 1": {
        if (this.operadorLogico === '') {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar un operador lógico",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        } else if (this.formCriterio.controls['descCriterio'].value === '') {

          Swal.fire({
            icon: "error",
            title: "Falta agregar información en el campo Valor",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        }

        break
      }
      case "FILTRO 2": {
        this.formCriterio.controls['descCriterio'].clearValidators();
        this.formCriterio.controls['condicion'].clearValidators();
        this.formCriterio.controls['condicion2'].clearValidators();
        this.formCriterio.controls['date'].clearValidators();
        this.formCriterio.controls['date2'].clearValidators();

        if (this.operadorLogico === '') {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar un operador lógico",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        } else if (!this.date.value) {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar una fecha.",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        }

        break;
      }
      case "FILTRO 3": {
        if (!this.date.value) {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar una fecha de inicio.",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        } else if (!this.date2.value) {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar una fecha final.",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        } else if (this.operadorLogico === '') {

          Swal.fire({
            icon: "error",
            title: "Falta seleccionar un operador lógico",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 2000
          });
          return
        }
        break;
      }
      default: {
        Swal.fire({
          icon: "error",
          title: "Debe seleccionar un tipo de filtro",
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 2000
        });
        return

      }
    }

    if (this.idFiltroSeleccionado === '5') {

      let index = this.criterios.findIndex(x => x.id === '5');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      condicion.valor = this.formCriterio.controls['descCriterio'].value;
      this.condiciones5.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones5;
      this.criterios.push(this.citerioSeleccionado);
    } else if (this.idFiltroSeleccionado == '3') {
      let index = this.criterios.findIndex(x => x.id === '3');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      if (this.operadorLogico === 'está entre') {
        if (this.date.value > this.date2.value) {
          console.log('la fecha inicial es mas grande que la otra')
          Swal.fire({
            icon: "error",
            title: "La fecha inicial es mayor que la final, modifique la selección.",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

          return
        }
        condicion.valor = this.date.value + ' ' + this.date2.value;
      } else {
        condicion.valor = this.date.value
      }

      this.condiciones3.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones3;
      this.criterios.push(this.citerioSeleccionado);

    } else if (this.idFiltroSeleccionado === '4') {
      let index = this.criterios.findIndex(x => x.id === '4');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      if (this.operadorLogico === 'está entre') {
        if (this.date.value > this.date2.value) {
          console.log('la fecha inicial es mas grande que la otra')
          Swal.fire({
            icon: "error",
            title: "La fecha inicial es mayor que la final, modifique la selección.",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });
          return

        }
        condicion.valor = this.date.value + ' ' + this.date2.value;

      } else {
        condicion.valor = this.date.value
      }

      this.condiciones4.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones4;
      this.criterios.push(this.citerioSeleccionado);

    } else if (this.idFiltroSeleccionado == '6') {
      let index = this.criterios.findIndex(x => x.id === '6');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      condicion.valor = this.formCriterio.controls['descCriterio'].value;
      this.condiciones6.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones6;
      this.criterios.push(this.citerioSeleccionado);
    } else if (this.idFiltroSeleccionado == '7') {
      let index = this.criterios.findIndex(x => x.id === '7');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      condicion.valor = this.formCriterio.controls['descCriterio'].value;
      this.condiciones7.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones7;
      this.criterios.push(this.citerioSeleccionado);
    } else if (this.idFiltroSeleccionado == '8') {
      let index = this.criterios.findIndex(x => x.id === '8');
      if (index >= 0) {
        this.criterios.splice(index, 1);
      }

      this.citerioSeleccionado = new CriteriosModel;
      let condicion = new CondicionesModel;
      condicion.filtro = this.operadorLogico;
      condicion.valor = this.formCriterio.controls['descCriterio'].value;
      this.condiciones8.push(condicion)

      this.citerioSeleccionado.id = this.idFiltroSeleccionado;
      this.citerioSeleccionado.descripcion = this.filtroSeleccionado;
      this.citerioSeleccionado.condiciones = this.condiciones8;
      this.criterios.push(this.citerioSeleccionado);
    }


    this.formCriterio.reset();
    Object.keys(this.formCriterio.controls).forEach(key => {
      this.formCriterio.get(key).setErrors(null);
    });
    Swal.fire({
      icon: "success",
      title: "Filtros agregado con Exito!",
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: true,
      timer: 4000
    });
    this.idFiltroSeleccionado = '10';
    this.operadorLogico = '';
    this.date = new FormControl(moment());
    this.date2 = new FormControl(moment());

    this.buscaPorCriterios(0);
  }

  cancelarFiltro() {

    this.idFiltroSeleccionado = '10';
    this.operadorLogico = '';
    this.formCriterio.reset();
    //this.buscaPorCriterios(0);
  }


  borraCrtiterioLista(idCriterio, valor) {
    let index = this.criterios.findIndex(x => x.id.toString() === idCriterio.toString());
    let valorCon = this.criterios[index].condiciones.findIndex(x => x.valor === valor);
    this.criterios[index].condiciones.splice(valorCon, 1);
    this.buscaPorCriterios(0);
  }

  borraCriterio(event) {

    event.stopPropagation();
    Swal.fire({

      text: "¿Esta seguro quiere eliminar el filtro " + this.nameCriterio + "?",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      this.spinner.show();
      if (result.isConfirmed) {


        this.busquedasService.borrarFiltrosId(this.criterioComboSeleccionado).subscribe(data => {
          this.consultaCriteriosId(this.tokenStorageService.getUserName());
          Swal.fire({
            icon: "success",
            title: "Filtros eliminado con Exito!",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 8000,
          });

          this.nameCriterio = '';

        });

        /*      let index = this.comboCriterios.findIndex(x => x.id === idCriterio);
             this.comboCriterios.splice(index, 1); */


      }
      this.spinner.hide();
    })


  }

  cambioRadio(event) {
    // console.log(" Value is : ", event );
  }

  guardaBusqueda() {
    this.guardaCriterios = new GuardaCriteriosModel();
    this.guardaCriterios.busquedaJson = {
      codUsr: '',
      codCentro: '',
      criterios: []
    };
    this.guardaCriterios.idCatPantFk = 1;
    this.guardaCriterios.busquedaJson.codUsr = this.tokenStorageService.getUserName();
    this.guardaCriterios.busquedaJson.codCentro = 212;
    this.guardaCriterios.busquedaJson.criterios = this.criterios;
    Swal.fire({
      title: 'Ingrese el nombre con el que desea grabar los criterios de búsqueda',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Grabar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (nombre) => {
        this.guardaCriterios.nombreBusqueda = nombre;

        this.busquedasService.grabarBusqueda(this.guardaCriterios).subscribe(data => {
          this.consultaCriteriosId(this.tokenStorageService.getUserName());
          Swal.fire({
            icon: "success",
            title: "Filtros grabados con éxito!",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 8000
          });

        });
      }
    })
  }

  traerFiltrosGrabados(idUsuario) {
    this.busquedasService.grabarBusqueda(this.guardaCriterios).subscribe(data => {
      // This is intentional
    })
  }
  detalleAsunto(folio) {
    this.folio = folio;
    //this.showEmail($event)
    this.asuntosService.detalleAsunto(folio).subscribe(data => {

      this.idAsuntoSeleccionado = data.response.idAsunto;
      this.formDetalle.patchValue({
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
        'descripcionDetallada': data.response.dscDetallada,
        'detalleHistorico': '',
        'detalleHistoricoSolucion': ''
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
    this.estadoAsunto();
  }

  estadoAsunto() {
    this.asuntosService.detalleAsunto(this.folio).subscribe(data => {
      this.statusAsunto = data.response.idEstadoAsunto;
    });

  }

  reservarAsunto() {
    this.formReservar = {
      idAsunto: this.idAsuntoSeleccionado,
      idUsuarioResolutor: this.currentUser.idUsuario,
      modificaciones: 'El resolutor ' + this.currentUser.codigoUsuario + ' reservo el asunto'
    };
    this.asuntosService.reservarAsunto(this.formReservar).subscribe(data => {
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Se reservo el asunto ',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })
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
      });
    this.detalleAsunto(this.folio);
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
    if (data == null || data == undefined) {
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

  /**
 * Search email
 *
 * @param event     Convert value uppercase to lowercase;
 */
  updateFilter(event) {
    const value = event.target.value.toLowerCase();
    this.todosAsuntos = [...this.temp2]; // and here you have to initialize it with your data
    this.temp = [...this.todosAsuntos];
    // filter our data
    const temp = this.todosAsuntos.filter(function (d) {
      return d.categoria.toLowerCase().indexOf(value) !== -1 || !value;
    });
    // update the rows
    this.todosAsuntos = temp;
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
  showEmail(event) {
    // console.log(event);
    const toggleIcon = document.getElementById('app-details');
    if (event.currentTarget.className === 'media-body') {
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
    if (event.currentTarget.className === 'mat-focus-indicator btn-block active espacio mat-raised-button mat-button-base mat-warn cdk-focused cdk-mouse-focused') {
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
  /**
    * Filter Email
    *
    * @param term    search term
    */

  onKeydown(event) {

    // console.log(this.buscarInput)
    this.buscarInput = '';
  }

  search(term) {
    const searchTerm = term.currentTarget.value;
    if (searchTerm !== '') {
      this.todosAsuntos = this.todosAsuntos.filter(result => {
        if (result && searchTerm) {
          if (result.categoria.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            result.descripcion.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            result.folio.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    } else {
      this.todosAsuntos = this.temp2;
    }
  }

  selectAllEmails() {
    for (let i = 0; i < this.todosAsuntos.length; i++) {
      if (this.selectAll) {
        this.todosAsuntos[i].isSelected = false;
      } else {
        this.todosAsuntos[i].isSelected = true;
      }
    }
  }

  deleteCheckedRow() {
    let index = 0;
    const removedIndex = [];
    const temp = [...this.todosAsuntos];
    for (const row of temp) {
      if (row.isSelected === true) {
        removedIndex.push(index);
      }
      index++;
    }
    for (let i = removedIndex.length - 1; i >= 0; i--) {
      temp.splice(removedIndex[i], 1);
    }
    this.todosAsuntos = temp;
    this.selectAll = false;
  }
  showEmailMenu(Id, emailMenu) {
    for (let j = 0; j < emailMenu.length; j++) {
      for (let i = 0; i < this.emailMenuList.length; i++) {
        for (let k = 0; k < this.emailLable.length; k++) {
          this.show2(emailMenu, Id, j, i, k);

        }
      }
    }

    this.forShow(Id);
  }

  forShow(Id) {
    for (const friend of this.emailMenuList) {
      if (friend.Id === Id) {
        break;
      }
    }
  }
  show2(emailMenu, Id, j, i, k) {
    if (emailMenu[j].name === this.emailMenuList[i].name) {
      if (Id !== this.emailMenuList[i].Id) {
        this.emailMenuList[i].isSelected = false;
      }
      if (Id === this.emailMenuList[i].Id) {
        this.emailMenuList[i].isSelected = true;
        this.emailLable[k].isSelected = false;
      }
    } else if (emailMenu[j].name === this.emailLable[k].name) {
      if (Id !== this.emailLable[k].Id) {
        this.emailLable[k].isSelected = false;
      }
      if (Id === this.emailLable[k].Id) {
        this.emailLable[k].isSelected = true;
        this.emailMenuList[i].isSelected = false;
      }
    }
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

  botonReservar() {
    this.mostrar = false;
    this.step1++;
  }

  botonTratar() {
    this.mostrar2 = false;
    this.step2++;
  }
  cancelarTratar() {
    this.mostrar2 = true;
    this.step2++;
  }

  obtenerUsuarioByCodigo(user) {
    this.asuntosService.usuarioPorCodigoNegocio(user).subscribe(data => {
      this.currentUser = data.response;


      this.form.patchValue({
        'nombre': data.response.nombre,
        'telefono': data.response.telefonoUsuario,
        'movil': data.response.movilUsuario,
        'correo': data.response.correo
      });
    });
  }

  solucionarActivacion(value) {
    if (value === 1) {
      this.solucionarInfo = false;
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Solución de Asunto',
        text: 'Es necesario llenar los campos solicitados',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })
    } else if (value === 0) {
      this.solucionarInfo = true;
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Se cancela la solución ',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      this.detalleAsunto(this.folio)
    }

  }

  solucionarActivacion2(value) {
    if (value === 1) {
      this.solucionarInfo = false;
    } else if (value === 0) {
      this.solucionarInfo = true;
      this.detalleAsunto(this.folio)
    }

  }

  irInicio(value) {
    if (value === 1) {
      this.solicitarInfoDeta = false;
    } else if (value === 0) {
      this.solicitarInfoDeta = true;
      this.detalleAsunto(this.folio)
    }

  }


  habilitarCampos(value) {
    if (value === 1) {
      this.solicitarInfoDeta = false;
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Petición de información',
        text: 'Es necesario agregar una descripción detallada para la petición de información',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      })
    } else if (value === 0) {
      this.solicitarInfoDeta = true;
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Se cancela la petición de información',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      this.detalleAsunto(this.folio)
    }

  }

  peticionInformacion() {
    this.spinner.show();

    this.formPeticioInfo = {
      idAsunto: 0,
      descripcionDetallada: '',
      modificaciones: ''
    };

    this.formPeticioInfo.idAsunto = this.idAsuntoSeleccionado;
    this.formPeticioInfo.descripcionDetallada = this.formDetalle.value.detalleHistorico;
    this.formPeticioInfo.modificaciones = 'El resolutor ' + this.currentUser.nombre + ' con codigo ' + this.currentUser.codigoUsuario + ', solicita información al peticionario.';

    this.asuntosService.peticionInformacionResolutor(this.formPeticioInfo).subscribe(
      data => {
        if (this.formPeticioInfo.detalleHistorico === '') {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Falta el detalle de la petición',
            text: 'Es necesario agregar una descripción detallada para la petición de información',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });
        } else {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se realizo la petición con éxito',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          }),
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(['/portalSoluciones/consultaAsunto']));

        };
      },
      err => {
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: err.error.responseCode.message,
          text: err.error.responseCode.moreInfo,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      });

  }

  getClasificacionResolutor() {
    this.asuntosService.clasificacionResolutor().subscribe(
      data => {
        this.catalogoClasificacion = data.response;
      },
      error => {
        // This is intentional
      });
  }

  getPrioridades() {
    this.categoriasService.prioridadesCate().subscribe(
      data => {
        this.catalogoPrioridad = data.response;
      },
      error => {
        // This is intentional
      });
  }

  agreaUrl(): void {

    var urlSize = this.formDetalle.value.url;
    console.log('---Url---');
    console.log(urlSize.length);

    console.log('---Descripcion---');
    var descripcionSize = this.formDetalle.value.descripcionUrl
    console.log(descripcionSize.length);

    console.log('---Nombre---');
    var nombreSize = this.formDetalle.value.nombreUrl;
    console.log(nombreSize.length);

    if (!this.formDetalle.controls.url.valid) {
      Swal.fire({
        icon: 'error',
        title: 'El formato URL es invalido',
        text: 'Es necesario llenar los campos para agregar una nueva url',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
      return;
    }
    if (this.formDetalle.value.nombreUrl === '' || this.formDetalle.value.url === '' || this.formDetalle.value.descripcionUrl === '') {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Faltan campos en la url o el formato es invalido',
        text: 'Es necesario llenar los campos para agregar una nueva url',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else if (nombreSize.length < 3) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'No cumple con el tamaño mínimo',
        text: 'El nombre de url debe de tener mínimo 3 caracteres',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else if (descripcionSize.length < 3) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'No cumple con el tamaño mínimo',
        text: 'La descripción de url debe de tener mínimo 3 caracteres',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else if (urlSize.length > 300) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Excede el tamaño máximo ',
        text: 'La url debe de tener máximo 300 caracteres',
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        timer: 4000
      });
    } else {
      let urls = new ModelUrls();
      urls.nombreUrl = this.formDetalle.value.nombreUrl;
      urls.descripcion = this.formDetalle.value.descripcionUrl;
      urls.url = this.formDetalle.value.url;
      this.listaUrls.push(urls);
      this.limpiarUrl();
    }

  }
  limpiarUrl() {
    this.formDetalle.patchValue({
      'nombreUrl': '',
      'descripcionUrl': '',
      'url': ''
    });
  }

  eliminaUrls(idurl) {
    let index = this.listaUrls.findIndex(x => x.url === idurl);
    this.listaUrls.splice(index, 1);
  }

  onSelect(event) {
    // console.log(event);
    this.files.push(...event.addedFiles);

  }
  onRemove(event) {
    // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  MultiplefilesonRemove() {
    this.files.forEach(data => {
      this.files.splice(0, this.files.length);
    })
  }
  onRemoveAll() {
    this.newSteps = [];
  }


  solucionarAsunto() {
    this.spinner.show();
    this.archivosArray = [];

    this.toFilesBase64(this.files, this.selectedFiles).subscribe(
      (res: SelectedFiles[]) => {
        this.selectedFiles = res;
        // console.log("base 64");
        this.selectedFiles.forEach(res2 => {
          let splitted = res2.base64.split(";base64,", 3);
          let archivo = new ModelArchivo();
          archivo.nombreArchivo = res2.name;
          archivo.extension = splitted[0].substring(5);
          archivo.archivo = splitted[1];
          archivo.descripcion = 'Archivo de Evidencia'
          this.archivosArray.push(archivo);
        });

        this.formSolucionAsunto = {
          idAsunto: 0,
          descripcionDetallada: '',
          direccionContacto: '',
          telefonoContacto: '',
          idPrioridadPeticionario: null,
          idClasificacionResolutor: null,
          modificaciones: '',
          archivos: this.archivosArray,
          urls: this.listaUrls,
        };

        this.formSolucionAsunto.idAsunto = this.idAsuntoSeleccionado;
        this.formSolucionAsunto.descripcionDetallada = this.formDetalle.value.detalleHistoricoSolucion;
        this.formSolucionAsunto.direccionContacto = this.formDetalle.value.direccionContacto;
        this.formSolucionAsunto.telefonoContacto = this.formDetalle.value.movilContacto;
        this.formSolucionAsunto.idPrioridadPeticionario = this.formDetalle.value.idPrioridad;
        this.formSolucionAsunto.idClasificacionResolutor = this.formDetalle.value.idClasificacion;
        this.formSolucionAsunto.modificaciones = 'El resolutor '; //+ this.currentUser.codigoUsuario + ', le da solución al asunto';

        var sizeMovil = this.formSolucionAsunto.telefonoContacto;

        if (this.formSolucionAsunto.descripcionDetallada === '') {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Es necesario agregar el campo descripción detallada',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else if (this.formSolucionAsunto.direccionContacto === '') {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Es necesario agregar el campo dirección de contacto',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else if (this.formSolucionAsunto.telefonoContacto === '') {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Es necesario agregar el campo teléfono de contacto',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else if (sizeMovil.length != 10) {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'El teléfono de contacto debe de ser 10 caracteres exactos',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else if (this.formSolucionAsunto.idPrioridadPeticionario === null) {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Es necesario agregar una prioridad',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else if (this.formSolucionAsunto.idClasificacionResolutor === null) {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Es necesario agregar una clasificación',
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            timer: 4000
          });

        } else {

          this.asuntosService.solucionarAsuntoResolutor(this.formSolucionAsunto).subscribe(
            data => {
              this.spinner.hide();
              Swal.close();
              Swal.fire({
                icon: 'success',
                title: 'Se realizo la petición con éxito',
                showConfirmButton: false,
                showCancelButton: false,
                showCloseButton: true,
                timer: 4000
              }),
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                  this.router.navigate(['/portalSoluciones/consultaAsunto']));
            },
            err => {
              this.spinner.hide();
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: err.error.responseCode.message,
                text: err.error.responseCode.moreInfo,
                showConfirmButton: false,
                showCancelButton: false,
                showCloseButton: true,
                timer: 4000
              });
            });
        }
      }
    );
  }

  public toFilesBase64(
    files: File[],
    selectedFiles: SelectedFiles[]
  ): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(
            (f) => f?.name !== files[i]?.name
          );
          selectedFiles.push({
            name: files[i]?.name,
            file: files[i],
            base64: reader?.result as string,
          });
          result.next(selectedFiles);
          if (files?.length === i + 1) {
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  public onFileSelected(files: File[]) {
    this.archivosArray = [];
    this.toFilesBase64(files, this.selectedFiles).subscribe(
      (res: SelectedFiles[]) => {
        this.selectedFiles = res;
        // console.log("base 64");
        this.selectedFiles.forEach(res2 => {
          let splitted = res2.base64.split(";base64,", 3);
          let archivo = new ModelArchivo();
          archivo.nombreArchivo = res2.name;
          archivo.extension = splitted[0].substring(5);
          archivo.archivo = splitted[1];
          archivo.descripcion = 'Archivo de Evidencia'
          this.archivosArray.push(archivo);
        });

      }
    );
  }



}
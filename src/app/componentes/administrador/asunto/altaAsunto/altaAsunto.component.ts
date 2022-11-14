import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCalendar } from "@angular/material/datepicker";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Moment } from "moment";
import { AsyncSubject, Observable } from "rxjs";
import { Category } from "src/app/app.models";
import { AsuntosService } from "src/app/_services/asuntos.service";
import { ProductoService } from "src/app/_services/productos.service";
import Swal from 'sweetalert2';
import { ModelAsunto } from "src/app/models/asuntoModels/asunto.model";
import { ModelAsunto2 } from "src/app/models/asuntoModels/asunto2.model";
import { CategoriasService } from "src/app/_services/categorias.services";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ModelArchivo } from "src/app/models/asuntoModels/archivosAsunto.model";
import { AutoAyudaService } from "src/app/_services/autoAyuda.service";
import { ModelEncuesta } from "src/app/models/autoayudaModel/EncuestaSatisfaccion.model";
import { NgxSpinnerService } from "ngx-spinner";
import { CentrosService } from "src/app/_services/centros.service";
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { PerfilesService } from "src/app/_services/perfiles.service";
import { ModelUrls } from "src/app/models/asuntoModels/urlsAsunto.model";
import { NoopAnimationPlayer, state } from "@angular/animations";
import { ModelPregunta } from "src/app/models/autoayudaModel/preguntaModel.model";
import { ModelAnexo } from "src/app/models/autoayudaModel/anexosModel.model";
import { ModelAnexoUrl } from "src/app/models/autoayudaModel/anexosUrlModel.model";
import { ThisReceiver } from "@angular/compiler";

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

export interface SelectedFiles {
  name: string;
  file: any;
  base64?: string;
}
const reg = '(https?://.*)';
@Component({
  selector: 'app-alta-asunto',
  templateUrl: './altaAsunto.component.html',
  styleUrls: ['./altaAsunto.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class AltaAsuntoComponent implements OnInit, AfterViewInit {
  @BlockUI('dropzoneGallery') blockUIDropzone: NgBlockUI;

  public selectedFiles: SelectedFiles[] = [];
  formAsunto: ModelAsunto = {};
  formAsunto2: ModelAsunto2 = {};
  archivosArray: Array<ModelArchivo> = [];

  public estatus = ["Estatus 1", "Estatus 2", "Estatus 3"];

  public prioridad = ["Prioridad 1", "Prioridad 2", "Prioridad 3"];

  public clasificacion = ["Clasificacion 1", "Clasificacion 2", "Clasificacion 3"];

  public motivo = ["Motivo 1", "Motivo 2", "Motivo 3"];

  public clasifigestioncacion = ["Gestion 1", "Gestion 2", "Gestion 3"];

  public categoria = ["Categoria 1", "Categoria 2", "Categoria 3"];

  step2 = 0;
  mostrar: boolean = true;
  displayedColumns: string[] = ['numero', 'fecha', 'resolutor', 'estado', 'centro', 'categoria'];

  displayedColumnsA: string[] = ['id', 'descripcion', 'descarga'];
  dataSourceA: any;
  displayedColumnsU: string[] = ['id', 'descripcion', 'txtUrl', 'dscDetll'];
  dataSourceU: any;
  /*   @ViewChild(MatPaginator) tableAPaginator: MatPaginator;
    
    @ViewChild(MatPaginator) tableUPaginator: MatPaginator; */

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  result: import("sweetalert2").SweetAlertResult<any>;

  @ViewChild('calendar') calendar: MatCalendar<Moment>;
  preguntasArray: Array<ModelPregunta> = [];
  anexosArray: Array<ModelAnexo> = [];
  anexosUrlArray: Array<ModelAnexoUrl> = [];
  selectedDate: Moment;
  files: File[] = [];
  public form: FormGroup;
  idCategoriaFinal = 0;
  autoAyudaListD: any[] = [];
  formEncuesta: ModelEncuesta = {};
  calificacion = '';
  listaUrls: Array<ModelUrls> = [];
  public selectedColors: string;
  public categories: Category[];
  private sub: any;
  public id: any;
  file: any;
  centroDelUsuario: any;
  public currentUser: any;
  categoriasLista: any[];
  nuevaCatego = 0;
  step = 0;
  bandera = 0;
  cateTot = 'Categoría Seleccionada: ';
  bufferValue = 75;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;
  currentFile: File;
  data: any;
  urlImagenes = [];
  datos: any;
  idCategoria: any;
  public unlock = false;
  ultimoId = '';
  nombreCat = '';
  idPreguntaEncuesta: any;
  showCategorias: boolean = true;
  formSolicitudSatisfactoria: any;
  urlCheck: any;
  descricpcionCheck: any;
  nombreCheck:any;
  mostrarAlta:boolean = false;
  muestraSiguiente: boolean = false;

  constructor(
    private centroService: CentrosService,
    private perfilesService: PerfilesService,
    private autoAyudaService: AutoAyudaService,
    private spinner: NgxSpinnerService,
    public productoService: ProductoService,
    public asuntosService: AsuntosService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private categoriasService: CategoriasService,
    private router: Router) {
    this.newSteps.push({ title: null, value: null });
  }


  isLinear = false;
  formGroup: FormGroup;
  formStepper: FormArray;
  @ViewChild('stepper') stepper;
  stepOptions = [
    { label: 'Buy Groceries', value: '1' },
    { label: 'Cook Dinner', value: '2' },
    { label: 'Go To Sleep', value: '3' },
    { label: 'Go To Work', value: '4' },
    { label: 'Wake Up', value: '5' }
  ]
  newSteps = [];
  ngAfterViewInit() {
    this.dataSourceA.paginator = this.paginator.toArray()[1];
    this.dataSourceU.paginator = this.paginator.toArray()[0];

  }
  isSet = (value) => {
    return value !== undefined && value !== null;
  }

  addItem() {
    this.newSteps.push({ title: null, value: null });
    this.stepper.selectedIndex = this.newSteps.length - 1;
  }
  changeStep(event, index) {

    let x = this.stepper.selectedIndex

    let cate = this.categoriasLista[event.source.defaultTabIndex];



    let i = this.categoriasLista.findIndex(data => data.idCatAsntPk.toString() === event.value.toString())


    // console.log(this.categoriasLista[i]);
    if (this.categoriasLista[i].idCatAsntPk == event.value) {
      this.cateTot = this.cateTot + ' ' + '>' + ' ' + this.categoriasLista[i].dscCatAsnto;
      this.newSteps[x].title = this.categoriasLista[i].dscCatAsnto;
      this.newSteps[x].value = this.categoriasLista[i].idCategAsntPadreFk

      this.categoriasService.consultarHijasId(this.categoriasLista[i].idCatAsntPk).subscribe(data => {

        if (data.responseCode.description == 'pregunta') {
          this.step++;
          this.bandera = 1;
          this.idCategoria = this.categoriasLista[i].idCatAsntPk;
        } else {
          this.categoriasLista = data.response;
          // console.log('categorias HIJAS');
          this.newSteps.push({ title: null, value: null });
          this.newSteps[x + 1].title = "selecciona sub Categoria";
          this.newSteps[x + 1].value = null;
          this.stepper.selectedIndex = (x + 1);
          this.mostrarAlta = false;

        }
      }, error => {
        if (error.error.responseCode.description == 'pregunta') {
          this.mostrarAlta = true;
          this.step++;
          this.bandera = 1;
          this.idCategoria = this.categoriasLista[i].idCatAsntPk;

          //this.traerPorId(this.ultimoId);
        } else {
          this.categoriasLista = error.response;
          // console.log('categorias HIJAS');
          this.newSteps.push({ title: null, value: null });
          this.newSteps[x + 1].title = "selecciona sub Categoria";
          this.newSteps[x + 1].value = this.categoriasLista[i].idCategAsntPadreFk;
          this.stepper.selectedIndex = (x + 1);
          this.mostrarAlta = false;

        }
      }
      );
    }





    // // console.log(event.value, index, this.stepperIndex)
  }
  regresaCateg(){
    this.mostrarAlta = false;

  }
  public onStepChange(event: any): void {

    if (event.selectedIndex !== 0) {
      this.muestraSiguiente = true;
      
      // console.log(this.newSteps[event.selectedIndex].value);

      let total = this.newSteps.length;
      let cuantos = total - event.selectedIndex - 1;
      let x = this.newSteps[event.selectedIndex].value
      if (event.selectedIndex < this.newSteps.length - 1) {
        for (let i = 0; i < cuantos; i++) {
          this.newSteps.splice(this.newSteps.length - 1, 1);
        }
      }




      this.getCategorias(x)
    }
    else {
      
      this.muestraSiguiente = false;
      this.cateTot = 'Categoría Seleccionada: ';
      this.newSteps = [];
      this.newSteps.push({ title: "¡Selecciona una Categoría!", value: 0 });
      this.iniciaStepepr();
      this.getCategorias(0);
      this.bandera = 0;
    }
  }

  iniciaStepepr() {
    this.newSteps[0].title = "¡Selecciona una Categoría!";
    this.newSteps[0].value = 0;
  }

  stepSeleccionado(event, index) {
    // console.log(event.value + "este selecciono en el estepper")
  }

  onRemoveAll() {
    this.newSteps = [];
  }

  removeStep(i) {

    this.newSteps.splice(i, 1);
  }

  atrasStep() {
    this.mostrarAlta = false;
    this.stepper.selectedIndex = this.newSteps.length - 1;

  }

  ngOnInit(): void {
    this.idPreguntaEncuesta = 0;
    this.idCategoria = 0;
 
    let idCat = this.activatedRoute.snapshot.params.idCat;
    // console.log('este es el puto idcat');
    // console.log(idCat);


    if(idCat.toString() !== '0'){
      let splitted: any[] = idCat.split(":");
      this.showCategorias = false;
      this.mostrarAlta = true;
      this.idCategoria = splitted[0];
      this.nombreCat = splitted[1];
      this.nextStep();
      this.nextStep2();

    }


    this.obtenerUsuarioByCodigo(this.tokenStorageService.getUserName());

    //this.traerPreguntaPorId(123);//-VALOR DURO-Cataegoria de la seleccion de arriba

    this.getCategorias(this.nuevaCatego)
    this.iniciaStepepr();

    this.data = {
      name: '',
      oldPrice: 0,
      newPrice: 0,
      discount: 0,
      description: '',
      availibilityCount: 0,
      color: [],
      size: [],
      weight: 0,
      categoryId: 0
    }
    this.form = this.formBuilder.group({
      nombre: [''],
      telefono: [''],
      movil: [''],
      correo: [''],
      direccionContacto: ['', Validators.required],
      movilContacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      descripcionBreveAsunto: ['', Validators.required],
      fechaCreacion: [''],
      estadoAsunto: [''],
      motivoReapertura: [''],
      categoria: [''],
      centro: [''],
      telefonoCentro: [''],
      direccionCentro: [''],
      descripcionDetallada: ['', Validators.required],
      nombreUrl: [''],
      url: ['', [Validators.maxLength(300), Validators.pattern(reg)]],
      descripcionUrl: ['']

    });
    //this.getCategories();
    this.sub = this.activatedRoute.params.subscribe(params => {
      /**   if (params['id']) {
          this.id = params['id'];
          this.getProductById();
        }
        */
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

  obtenerUsuarioByCodigo(user) {
    this.asuntosService.usuarioPorCodigoNegocio(user).subscribe(data => {
      this.currentUser = data.response;
      //console.log(this.currentUser);

      this.form.patchValue({
        'nombre': data.response.nombre,
        'telefono': data.response.telefonoUsuario,
        'movil': data.response.movilUsuario,
        'correo': data.response.correo
      });
      this.obtenerCentro(this.currentUser.idCentro);
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

      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.result = result;
    });
  }
  public getCategorias(idPadre) {

    if (idPadre == '') {

      this.categoriasService.consultarPadres().subscribe(data => {
        this.categoriasLista = data.response;
        // console.log('categorias padre');
      });

    } else {
      this.mostrarAlta = false;
      this.categoriasService.consultarHijasId(idPadre).subscribe(data => {
        this.categoriasLista = data.response;
        // console.log('categorias HIJAS');
      });
      this.ultimoId = idPadre;
    }
  }

  public onColorSelectionChange(event: any) {
    if (event.value) {
      this.selectedColors = event.value.join();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setStep(index: number) {
    if (this.idCategoria === 0) {
      //This intentional
    } else {
      this.traerPorId(this.idCategoria);
      this.step = index;
    };

  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  setStep2(index: number) {
    this.step2 = index;
  }

  nextStep2() {
    this.mostrar = false;
    this.step2++;
  }

  prevStep2() {
    this.mostrar = true;
    this.step2--;
  }

  guardar():void {

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

    this.formAsunto2 = {
      peticionario:
      {
        codigoUsuario: '',
        nombre: '',
        mail: '',
        telefono: '',
        movil: '',
        idCentro: 0
      },
      dscBreve: '',
      dscDetallada: '',
      direccionContacto: '',
      telefonoContacto: '',
      idCategoria: 0,
      idPrioridadPeticionario: 0,
      modificaciones: '',
      archivos: this.archivosArray,
      urls: this.listaUrls,
      formularios: [

        {
          idPregunta: 1,
          respuesta: 'respuesta'
        }
      ]
    };

    this.formAsunto2.peticionario.codigoUsuario = this.currentUser.codigoUsuario;
    this.formAsunto2.peticionario.nombre = this.form.value.nombre;
    this.formAsunto2.peticionario.mail = this.form.value.correo;
    this.formAsunto2.peticionario.telefono = this.form.value.telefono;
    this.formAsunto2.peticionario.movil = this.form.value.movil;
    this.formAsunto2.peticionario.idCentro = this.centroDelUsuario.codigoCentro;
    this.formAsunto2.dscBreve = this.form.value.descripcionBreveAsunto;
    this.formAsunto2.dscDetallada = this.form.value.descripcionDetallada;
    this.formAsunto2.direccionContacto = this.form.value.direccionContacto;
    this.formAsunto2.telefonoContacto = this.form.value.movilContacto;
    this.formAsunto2.idCategoria = this.idCategoria; //-VALOR DURO-Number(this.ultimoId); 
    this.formAsunto2.idPrioridadPeticionario = 1; //-VALOR DURO-como se relaciona con la categoria de arriba
    this.formAsunto2.modificaciones = 'El usuario ' + this.currentUser.codigoUsuario + ' creo el asunto. Estatus Nuevo';

    var movilSize = this.formAsunto2.telefonoContacto;
    // console.log(this.formAsunto2);
    if (this.form.valid) {

      this.asuntosService.crearAsunto(this.formAsunto2).subscribe(
        data => {
          this.spinner.hide();
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Se Registro El Asunto Con Exito',
            showConfirmButton: true,
            confirmButtonText: 'Ver Detalle Del Asunto:' + data.response.folio,
            showCloseButton: true
          }).then((result) => {
            if (result.value) {
              this.router.navigate(['/portalSoluciones/detalleAsunto/' + data.response.folio])
            } else {

              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/portalSoluciones/altaAsunto/0']));
            }
          })

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
        }
      );
    } else {
      if (this.form.value.direccionContacto === '') {
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Validaciones!',
          text: 'Llena el campo de dirección en el apartado datos de contacto',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });

      } else if (this.form.value.movilContacto === '') {
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Validaciones!',
          text: 'Llena el campo de móvil en el apartado datos de contacto',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      } else if (this.form.value.descripcionBreveAsunto === '') {
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Validaciones!',
          text: 'Llena el campo de descripción breve en el apartado datos del asunto',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      } else if (this.form.value.descripcionDetallada === '') {
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Validaciones!',
          text: 'Llena el campo de descripción detallada',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      } else if(movilSize.length != 10){
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Faltan Validaciones!',
          text: 'Debe de tener 10 caracteres el teléfono móvil',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      }else{
        this.spinner.hide();
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: '¡Ocurrió un error!',
          text: 'Contactar a sistemas ',
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: true,
          timer: 4000
        });
      }
    }

  }
  );



  }

  regresarBoton() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/portalSoluciones/altaAsunto/0']));
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSelect(event) {
    // console.log(event);
    this.files.push(...event.addedFiles);
  
  }

  onRemove(event) {
    // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
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

  MultiplefilesonRemove() {
    this.files.forEach(data => {
      this.files.splice(0, this.files.length);
    })
  }

  // traerPreguntaPorId(categoria) {
  //   this.autoAyudaService.traerAutoAyudaPorId(categoria).subscribe(data => {

  //     // console.log(data.response);
  //     //this.autoAyudaListD = data.response;
  //   });
  // }


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
              this.router.navigate(['/portalSoluciones/altaAsunto/0']));

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
    //var rep = [];
    if (event.checked === true) {
      userResponse.push(opt);
    }
    if (event.checked === false) {
      let index: number = userResponse.indexOf(opt);
      userResponse.splice(index, 1);
    }
    //console.info(opt);
    this.calificacion = opt;
  }

  obtenerCentro(id) {
    this.centroService.centroPorId(id).subscribe(data => {
      this.centroDelUsuario = data.response;
      this.form.patchValue({
        'centro': data.response.nombre,
        'telefonoCentro': data.response.telefono,
        'direccionCentro': data.response.calle + ', ' + data.response.ciudad + ', ' + data.response.cp,
      });
    });
  }

  agreaUrl(): void {

    var urlSize = this.form.value.url;
    console.log('---Url---');
    console.log(urlSize.length);

    console.log('---Descripcion---');
    var descripcionSize = this.form.value.descripcionUrl
    console.log(descripcionSize.length);

    console.log('---Nombre---');
    var nombreSize = this.form.value.nombreUrl;
    console.log(nombreSize.length);

      if (!this.form.controls.url.valid) {
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
      if (this.form.value.nombreUrl === '' || this.form.value.url === '' || this.form.value.descripcionUrl === '') {
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
        urls.nombreUrl = this.form.value.nombreUrl;
        urls.descripcion = this.form.value.descripcionUrl;
        urls.url = this.form.value.url;
        this.listaUrls.push(urls);
        this.limpiarUrl();
      }
    
  }

  eliminaUrls(idurl) {
    let index = this.listaUrls.findIndex(x => x.url === idurl);
    this.listaUrls.splice(index, 1);
  }

  reloadComponent() {
    window.location.reload();
  }

  limpiarUrl() {
    this.form.patchValue({
      'nombreUrl': '',
      'descripcionUrl': '',
      'url': ''
    });
  }

  traerPorId(categoria) {
    this.spinner.show();
    this.idCategoria = categoria;
    this.autoAyudaService.traerAutoAyudaPorId(this.idCategoria).subscribe(data => {
      this.preguntasArray = [];
      this.anexosArray = [];
      this.anexosUrlArray = [];
      data.response.content.forEach(datax => {
        let preguntaA = new ModelPregunta();
        preguntaA.grlPreg = datax.pregunta.grlPreg;
        preguntaA.grlResp = datax.pregunta.grlResp;
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
    this.spinner.hide();
  }

  cargarAnexos(id) {
    this.idPreguntaEncuesta = id;
    let anexoTabla = new Array<ModelAnexo>;
    this.anexosArray.forEach(data => {
      if (data.idPregRelCateg == id) {
        anexoTabla.push(data);
      }
    })
    this.dataSourceA = new MatTableDataSource();
    this.dataSourceA.data = anexoTabla;
    this.dataSourceA.paginator = this.paginator.toArray()[1];

    let anexoUrl = new Array<ModelUrls>;
    this.anexosUrlArray.forEach(data => {
      if (data.idPregRelCateg == id) {
        anexoUrl.push(data);
      }
    })
    this.dataSourceU = new MatTableDataSource();
    this.dataSourceU.data = anexoUrl;
    this.dataSourceU.paginator = this.paginator.toArray()[0];
  }

  crearAsuntoBoton() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/portalSoluciones/altaAsunto/0']));
  }


  limpiarDataTable() {
    this.dataSourceA = new MatTableDataSource();
    this.dataSourceU = new MatTableDataSource();
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

  solucionSatisfactoria() {

    this.formSolicitudSatisfactoria = {
      idPregRelCateg: 0,
      idUsuarioFk: 0
    }

    this.formSolicitudSatisfactoria.idPregRelCateg = this.idPreguntaEncuesta;
    this.formSolicitudSatisfactoria.idUsuarioFk = this.currentUser.idUsuario;
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
      this.autoAyudaService.evaluacion(this.formSolicitudSatisfactoria).subscribe(
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
            this.router.navigate(['/portalSoluciones/altaAsunto/0']));

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

    }


  }

}
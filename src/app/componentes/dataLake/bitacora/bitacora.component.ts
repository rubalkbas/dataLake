
import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DataLakeCatalogoService } from "src/app/_services/CatalogosDataLake.service";
import { BitacoraDataLakeService } from "src/app/_services/BitacoraDataLake.service";


import Swal from "sweetalert2";
export interface CatalogoTabla {
  nameTable: string;
  descBaseDatos: string;
  fechaInicioJob: string;
  fechaFinJob: string;
  nombreArchivoControl: string;
  nombreArchivoDetalle: string;
  numeroRegistros: string;
 
 
}

const ELEMENT_DATA: CatalogoTabla[] = [
  {nameTable : '1', descBaseDatos: 'Ingenium', fechaInicioJob : 'Ejemplo TABLA 1',fechaFinJob : '1', nombreArchivoControl: 'Ingenium', nombreArchivoDetalle : 'Ejemplo TABLA 1',numeroRegistros : '1' },
 
  
];

@Component({
    selector: 'app-bitacora',
    templateUrl: './bitacora.component.html',
    styleUrls: ['./bitacora.component.scss']
  })
  
  
  export class BitacoraComponent implements OnInit {


    //displayedColumns: string[] = ['jobId','cronExpression','cronJob','descripcion','interfaceName','jobClass','jobGroup','jobName','jobStatus','jobTable','repeatTime','acciones'];
    displayedColumns: string[] = ['nameTable','descBaseDatos','fechaInicioJob','fechaFinJob','nombreArchivoControl','nombreArchivoDetalle','numeroRegistros','detalle'];
    
    dataSource = new MatTableDataSource<CatalogoTabla>(ELEMENT_DATA);
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

    constructor(  public dialog: MatDialog ,
      private dataLakeCatalogoService:DataLakeCatalogoService,
      private BitacoraDataLakeService:BitacoraDataLakeService,
      private renderer: Renderer2,) {

    }

    ngOnInit(): void {
      this.BitacoraDataLakeService.consultarBitacora().subscribe(data=>{

        console.log(data);
        this.dataSource = new MatTableDataSource;
        
        this.dataSource.data = data.list;
  

      });
    }


    runJob(SchedulerJobInfo:any){

      if(SchedulerJobInfo.cronJob == '1'){
        SchedulerJobInfo.cronJob = 'true';
      }else{
        SchedulerJobInfo.cronJob = 'false';
      }

      this.dataLakeCatalogoService.runJobs(SchedulerJobInfo).subscribe(data=>{

        Swal.fire({
          icon: "success",
          title: "El Job comenzo a procesar!!!",
          showConfirmButton: true,
          timer: 2000,
        });
  

      });

    }
     /**
     * Open Media-body
     *
     * @param event   Mail Read
     */
      showEmail2(event, categoria) {
     
      
 
        const toggleIcon = document.getElementById('app-details');
        if (event.currentTarget.innerText === 'Detalle') {
          this.renderer.addClass(toggleIcon, 'show');
        } else if (event.currentTarget.innerText === 'Detalle') {
          this.renderer.removeClass(toggleIcon, 'show');
        }
    
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
  
  
    showEmail(event) {
      const toggleIcon = document.getElementById('app-details');
      if (event.currentTarget.className === 'mat-focus-indicator mat-raised-button mat-button-base') {
        this.renderer.addClass(toggleIcon, 'show');
      } else if (event.currentTarget.className === 'ficon feather ft-chevron-left font-medium-4 align-middle ft-maximize') {
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
    
        } else if (event.currentTarget.className === 'card collapse-header ng-star-inserted open') {
          this.renderer.removeClass(toggle, 'show');
          this.renderer.removeClass(toggleHeader, 'open');
          this.renderer.addClass(toggleIcon, 'collapsed');
         
        }
      }
    }
    /**
    * Add overlay when open sidebar
    *
    * @param event    Content overlay
    */
  
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
  
    

  }
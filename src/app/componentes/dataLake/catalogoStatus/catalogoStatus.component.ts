
import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { AltaStatusComponent } from "./AltaStatus/altaStatus.component";
 
 


export interface CatalogoTabla {
  idtabla: string;
  baseDatos: string;
  tabla: string;
 
}

const ELEMENT_DATA: CatalogoTabla[] = [
  {idtabla : '1', baseDatos: 'Ingenium', tabla : 'Ejemplo TABLA 1'},
  {idtabla : '2', baseDatos: 'OnBase', tabla : 'Ejemplo TABLA 2'},
  {idtabla : '3', baseDatos: 'Ingenium', tabla : 'Ejemplo TABLA 3'},
  
];

@Component({
    selector: 'app-catalogoStatus',
    templateUrl: './catalogoStatus.component.html',
    styleUrls: ['./catalogoStatus.component.scss']
  })
  
  export class CatalogoStatusComponent implements OnInit {

    formCriterio: FormGroup;
    displayedColumns: string[] = [ 'idCatEstatus','descEstatus','fechaAltaR','estatusR','accion'];
    dataSource = new MatTableDataSource<CatalogoTabla>(ELEMENT_DATA);
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
  tipoMov: string;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }

    constructor(  public dialog: MatDialog,
      private renderer: Renderer2,
      public formBuilder: FormBuilder, ) {

    }


    ngOnInit(): void {
      this.formCriterio = this.formBuilder.group({
        descEstatus: ['',],
      
      });
  
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
       
        
   
        const toggleIcon = document.getElementById('app-details');
        if (event.currentTarget.className === 'mat-focus-indicator mat-raised-button mat-button-base') {
          this.renderer.addClass(toggleIcon, 'show');
        } else if (event.currentTarget.className === 'ficon feather ft-chevron-left font-medium-4 align-middle') {
          this.renderer.removeClass(toggleIcon, 'show');
        }
    
      }
    
      showEmail(event) {
        const toggleIcon = document.getElementById('app-details');
        if (event.currentTarget.className === 'mat-focus-indicator mat-raised-button mat-button-base') {
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
      showComposeSidebar(event) {
        const toggleIcon = document.getElementById('compose-sidebar');
        const toggleSidebar = document.getElementById('sidebar-left');
        const toggleOverlay = document.getElementById('app-content-overlay');
        if (event.currentTarget.innerHTML === 'DETALLE') {
          this.tipoMov = 'mod';
        }else{
          this.tipoMov = 'alt';
        }
        
        if (event.currentTarget.className === 'mat-focus-indicator mat-raised-button mat-button-base cdk-focused cdk-mouse-focused' ||  event.currentTarget.innerHTML === 'DETALLE') {
          this.renderer.addClass(toggleIcon, 'show');
          this.renderer.removeClass(toggleSidebar, 'show');
          this.renderer.addClass(toggleOverlay, 'show');
        } else if (event.currentTarget.className === 'mat-focus-indicator mat-raised-button mat-button-base cdk-focused cdk-mouse-focused show' ||  event.currentTarget.innerHTML ===  'DETALLE show') {
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
    
  
 
     
  }
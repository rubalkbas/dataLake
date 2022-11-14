
import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
 
import { BlockUIModule } from 'ng-block-ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BlockTemplateComponent } from '../_layout/blockui/block-template.component';
  
import { BreadcrumbModule } from '../_layout/breadcrumb/breadcrumb.module';
 
 
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
 
 
 
  
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BlockCopyPasteDirective } from 'src/app/_directives/block-copy-paste.directive';
 
import { NgxSpinnerModule } from 'ngx-spinner';
  
import { BitacoraComponent } from './dataLake/bitacora/bitacora.component';
import { CatalogoTablasComponent } from './dataLake/catalogoTablas/catalogoTablas.component';
import { CatalogoBDComponent } from './dataLake/catalogoBaseDatos/catalogoBD.component';
import { AltaBDComponent } from './dataLake/catalogoBaseDatos/altaBD/altaClave.component';
import { AltaClaveComponent } from './dataLake/catalogoTablas/altaClave/altaClave.component';
import { ActualizaClaveComponent } from './dataLake/catalogoTablas/actualizaClave/actualizaClave.component';
import { CatalogoStatusComponent } from './dataLake/catalogoStatus/catalogoStatus.component';
import { AltaStatusComponent } from './dataLake/catalogoStatus/AltaStatus/altaStatus.component';
import { CatalogoRestriccionComponent } from './dataLake/catalogoRestricciones/catalogoRestriccion.component';





@NgModule({
    declarations: [ 
    
           
        BlockCopyPasteDirective,
   
        BitacoraComponent,
        CatalogoTablasComponent,
        CatalogoBDComponent,
        AltaBDComponent,
        AltaClaveComponent,
        ActualizaClaveComponent,
        CatalogoStatusComponent,
        AltaStatusComponent,
        CatalogoRestriccionComponent
        




    ],
    imports: [
   
        CommonModule,
        NgbModule,  
        BreadcrumbModule,
        PerfectScrollbarModule,
        FormsModule,
        CommonModule,
        NgbModule,
 
        ReactiveFormsModule,

        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
      
        MatCheckboxModule,
        MatChipsModule,
       
        MatDatepickerModule,

        MatExpansionModule,
        MatGridListModule,
  
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
     
        MatProgressBarModule,
 
        MatRadioModule,
        MatRippleModule,
   
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
  
        NgxSpinnerModule,
        MatCardModule,
    
 
        MatDialogModule,
       
        MatIconModule,
        MatPaginatorModule,

        MatSelectModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatStepperModule,
   
   
    PerfectScrollbarModule,
 
    NgxDropzoneModule,

        BlockUIModule.forRoot({
            template: BlockTemplateComponent
        }),


        FormsModule,

        RouterModule.forChild([
    
           
      
            
    /****** DATA LAKE *******/
    {
        path: 'bitacora',
        component: BitacoraComponent
    }, 
    {
        path: 'catalogoTablas',
        component: CatalogoTablasComponent
    } ,
    {
        path: 'catalogoDB',
        component: CatalogoBDComponent
    } ,

    {
        path: 'catalogoStatus',
        component: CatalogoStatusComponent
    } ,

    {
        path: 'catalogoRestriccion',
        component: CatalogoRestriccionComponent
    } ,

     
    
    
    
            

        ])
        

    ], exports: [RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [DatePipe]
})

export class ComponentesModule {
}

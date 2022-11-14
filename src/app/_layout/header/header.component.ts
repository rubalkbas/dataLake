import { Component, OnInit, Renderer2, AfterViewInit, HostListener, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ThemeSettingsService } from '../settings/theme-settings.service';
import { Subject } from 'rxjs';
import { AppConstants } from '../../_helpers/app.constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOCUMENT } from '@angular/common';
import { SettingsApp } from 'src/app/_common-model/settings-app';
import { AdminService } from 'src/app/_services/admin.service';
import { FuncionesPerfilService } from 'src/app/_services/funciones-perfil.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  layout: string;
  private _themeSettingsConfig: any;
  private _unsubscribeAll: Subject<any>;
  private isMobile = false;
  public selectedColorClass = '';

  constructor(private _renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private _themeSettingsService: ThemeSettingsService,
    private _adminService: AdminService,
    private funcionesPerfilService: FuncionesPerfilService,
    private deviceService: DeviceDetectorService) {
    this._unsubscribeAll = new Subject();
  }

    ngOnInit() {
    const self = this;

    this._themeSettingsService.config
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config) => {
      this._themeSettingsConfig = config;
      if (config.layout && config.layout.style &&
        config.layout.style === 'vertical') {
        self.layout = 'vertical';
      } else {
        self.layout = 'horizontal';
      }
      this.refreshView();
    });
    //valida la sesion de cookie

    /*  this._adminService.validaSesion().pipe().subscribe((data) => {
      console.info("VALIDA SESION DEVELOPMENT");
      console.info(data.response);
      if (data != null && data.response != null && data.response.sesion != null && data.response.sesion.sessionId != null) {
      

       if ( this.funcionesPerfilService.cargaFuncionesRolAcceso(data.response.sesion) == true) {

          // Subscribe to config changes
   
      
       }



      } else {
        // console.log('Redirige a login');
        this.document.location.href = SettingsApp.app.urlIntranetLogin;
      }
    },
    (error) => {

      this.ngOnInit();
      
      // This is intentional


    } );   */
  
  
  }

  refreshView() {
    const self = this;

    const headerElement = document.getElementsByClassName('header-navbar');
    if (headerElement.item(0)) {
      let currentHeaderClassList = [];
      const navbar = this.document.getElementById('navbar-mobile');
      // Layout
   
        currentHeaderClassList = ['header-navbar', 'navbar-expand-md', 'navbar', 'navbar-with-menu', 'navbar-without-dd-arrow', 'fixed-top',
          'navbar-shadow'];

        if (self._themeSettingsConfig.colorTheme === 'semi-dark' && self._themeSettingsConfig.layout.style === 'vertical') {
          self._renderer.addClass(headerElement.item(0), 'navbar-semi-dark');
          self._renderer.removeClass(headerElement.item(0), 'navbar-semi-light');
          self._renderer.removeClass(headerElement.item(0), 'navbar-light');
          self._renderer.removeClass(headerElement.item(0), 'navbar-dark');
          // self._renderer.removeClass(headerElement.item(0), 'bg-info');
        }  
     

      currentHeaderClassList.forEach(function (c) {
        self._renderer.addClass(headerElement.item(0), c);
      });

    }
  }

  ngAfterViewInit() {
    this.refreshView();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.refreshView();
  }

}

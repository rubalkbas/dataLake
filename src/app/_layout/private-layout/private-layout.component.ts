import { Component, OnInit, Renderer2, HostListener, Inject } from '@angular/core';
import { ThemeSettingsService } from '../settings/theme-settings.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppConstants } from '../../_helpers/app.constants';
import { Router, NavigationStart, NavigationEnd, Event, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NavbarService } from 'src/app/_services/navbar.service';
import { AdminService } from '../../_services/admin.service';
import { FuncionesPerfilService } from 'src/app/_services/funciones-perfil.service';
import { SettingsApp } from 'src/app/_common-model/settings-app';

//==============JSON PARA PROBAR LOCALMENTE==========================
import SessionJson from '../../../assets/local-sesion1.json';
import {LocalSesion} from '../../_bussines-model/local-session';
//===================================================================

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.css']
})
export class PrivateLayoutComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private _themeSettingsConfig: any;
  public layout: any;
  public customizer: any;
  deviceInfo = null;

  constructor(private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private navbarService: NavbarService,
    private _themeSettingsService: ThemeSettingsService,
    private _adminService: AdminService,
    private funcionesPerfilService: FuncionesPerfilService,
    private deviceService: DeviceDetectorService) {
    this._unsubscribeAll = new Subject();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        if (this.router.url === '/chats') {
          this.renderer.addClass(document.body, 'chat-application');
        } else {
          this.renderer.removeClass(document.body, 'chat-application');
        }
        if (this.eslaurl(this.router)) {
          this.renderer.addClass(document.body, 'email-application');
        } else {
          this.renderer.removeClass(document.body, 'email-application');
        }


      }

     
    });
  }
  eslaurl(router:any){


    if( this.router.url === '/portalSoluciones/busquedaCuentas'
          || this.router.url === '/portalSoluciones/busquedaAsuntosRe'
 
          || this.router.url === '/portalSoluciones/consultaAsunto'
          || this.router.url === '/portalSoluciones/consultaAsuntoPeticionario'
 
          || this.router.url === '/portalSoluciones/autoAyuda'
          || this.router.url === '/dataLake/catalogoDB'
          ){
            return true
          }
          return false

  }
  ngOnInit() {
    const _self = this;
    console.info('init user')

 

     if (SettingsApp.app.environment === 'LOCAL') {
         //==================================================
         console.info("VALIDA SESION LOCAL");
         let dataSesion: LocalSesion;
         dataSesion = SessionJson;
         console.info(dataSesion);
         this.funcionesPerfilService.cargaFuncionesRolAcceso(dataSesion);
         //==================================================
   
       } else {
           this._adminService.validaSesion().subscribe((data) => {
           console.info("VALIDA SESION DEVELOPMENT");
           console.info(data.response);
           if (data != null && data.response != null && data.response.sesion != null && data.response.sesion.sessionId != null) {
           
 
            this.funcionesPerfilService.cargaFuncionesRolAcceso(data.response.sesion);
           } else {
             // console.log('Redirige a login');
             this.document.location.href = SettingsApp.app.urlIntranetLogin;
           }
         });  
       }  




              this.renderer.removeClass(document.body, 'bg-full-screen-image');

              // Subscribe to config changes
              this._themeSettingsService.config
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((config) => {
                  this._themeSettingsConfig = config;
                  if (localStorage.getItem('currentLayoutStyle')) {
                    this._themeSettingsConfig.layout.style = localStorage.getItem('currentLayoutStyle');
                  }
                });
          
              this.deviceInfo = this.deviceService.getDeviceInfo();
              const isMobile = this.deviceService.isMobile();
              this.handleBody(isMobile);
          
              this.handleCollapsibleMenu();
      

  

       

       
  

   


  }
  handleBody2(isMobile: boolean,currentBodyClassList,_self) {
    const footer = document.getElementById('footer');
    // if (this.router.url == '/chats') {
    // const footer = document.getElementById('footer');
     if (currentBodyClassList.includes('fixed-bottom')) {
      currentBodyClassList.push('chat-application');
      currentBodyClassList = currentBodyClassList.filter(item => item !== 'fixed-bottom');
      footer.classList.remove('fixed-bottom');
    } 
    if ( this.router.url === '/portalSoluciones/busquedaCuentas'
      || this.router.url === '/portalSoluciones/busquedaAsuntosRe' 
      || this.router.url === '/portalSoluciones/consultaAsunto'
      || this.router.url === '/portalSoluciones/consultaAsuntoPeticionario' 
      || this.router.url === '/portalSoluciones/autoAyuda' 
      || this.router.url === '/dataLake/catalogoDB'
  ) {
      currentBodyClassList.push('email-application');
      // footer.classList.add('fixed-bottom');
    } else if (currentBodyClassList.includes('fixed-bottom')) {
      currentBodyClassList.push('email-application');
      currentBodyClassList = currentBodyClassList.filter(item => item !== 'fixed-bottom');
      footer.classList.remove('fixed-bottom');
    }


    

    currentBodyClassList.forEach(function (c) {
      _self.renderer.addClass(document.body, c);
    });
    this.handleFullScreen();

  }
  handleBody(isMobile: boolean) {
    let _self = this;

    if (this._themeSettingsConfig.layout.style === 'vertical') {
      _self.renderer.setAttribute(document.body, 'data-menu', 'vertical-menu-modern');
    }  

    let currentBodyClassList = [];
    this.layout = this._themeSettingsConfig.layout.style;
    this.customizer = this._themeSettingsConfig.customizer;
    // Vertical resposive view
    if (this._themeSettingsConfig.layout.style === 'vertical' &&
      window.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH) {
      const previosBodyClassList = [].slice.call(document.body.classList);
      previosBodyClassList.forEach(function (c) {
        _self.renderer.removeClass(document.body, c);
      });
      
      currentBodyClassList = this.fixMenu(currentBodyClassList);

 
      // Horizontal resposive view
    }   else {
      const previosBodyClassList = [].slice.call(document.body.classList);
      let callapseOrExpanded = '';
      previosBodyClassList.forEach(function (c) {
        if (c === 'menu-collapsed') {
          callapseOrExpanded = 'menu-collapsed';
        } else if (c === 'menu-expanded') {
          callapseOrExpanded = 'menu-expanded';
        }
        _self.renderer.removeClass(document.body, c);
      });
      callapseOrExpanded =  this.fixMenu2(callapseOrExpanded);
       // callapseOrExpanded = callapseOrExpanded !== '' ? callapseOrExpanded : 'menu-collapsed';
    currentBodyClassList = ['vertical-layout', 'vertical-menu-modern', '2-columns', 'pace-done', 'menu-close', callapseOrExpanded];

    if (this._themeSettingsConfig.layout.pattern === 'fixed') {
      currentBodyClassList.push('fixed-navbar');
    }
    }
    this.handleBody2(isMobile,currentBodyClassList,_self);
    
  }
fixMenu2(callapseOrExpanded){
  if (this._themeSettingsConfig.layout.style === 'vertical') {
    if (callapseOrExpanded === '') {
      const toggleIcon = document.getElementsByClassName('toggle-icon');
      if (toggleIcon.item && toggleIcon.item(0) &&
        toggleIcon.item(0).classList.contains('ft-toggle-right')) {
        callapseOrExpanded = 'menu-expanded';
      } else {
        callapseOrExpanded = 'menu-collapsed';
      }
    }

   

  }  

  return callapseOrExpanded;
}
fixMenu(currentBodyClassList){
  if (this._themeSettingsConfig.layout.style === 'vertical') {
    currentBodyClassList = ['vertical-layout', 'vertical-overlay-menu', '2-columns', 'pace-done', 'menu-close', 'fixed-navbar'];
    if (this._themeSettingsConfig.layout.pattern === 'fixed') {
      currentBodyClassList.push('fixed-navbar');
    }
  } 
  if (this._themeSettingsConfig.layout.pattern === 'fixed') {
    currentBodyClassList.push('fixed-navbar');
  }
return currentBodyClassList;
}
  handleFullScreen() {
    const toggleIcon = document.getElementsByClassName('ficon');
    if (window.innerWidth === screen.width && window.innerHeight === screen.height && toggleIcon.item(0)) {
      this.renderer.removeClass(toggleIcon.item(0), 'ft-maximize');
      this.renderer.addClass(toggleIcon.item(0), 'ft-minimize');
    } else if (toggleIcon.item(0)) {
      this.renderer.addClass(toggleIcon.item(0), 'ft-maximize');
      this.renderer.removeClass(toggleIcon.item(0), 'ft-minimize');
    }
  }

  handleCollapsibleMenu() {
    if (this._themeSettingsConfig.menu === 'collapse') {
      // show the left aside menu
      this.navbarService.setFixedMenu(false);
      this.document.body.classList.remove('menu-expanded');
      this.document.body.classList.add('menu-collapsed');
    } else {
      this.navbarService.setFixedMenu(true);
      this.document.body.classList.remove('menu-collapsed');
      this.document.body.classList.add('menu-expanded');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const menuClose = document.body.getElementsByClassName('menu-close');
    const toggle = document.getElementsByClassName('content-overlay');
    const sidenavOverlay = document.getElementsByClassName('sidenav-overlay');
    const emailMenu = document.getElementsByClassName('email-app-menu');
    const toggleIcon = document.getElementById('sidebar-left');

    if (event.target.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH) {
      this.handleBody(true);
      if (menuClose) {
        this.renderer.removeClass(sidenavOverlay.item(0), 'd-block');
        this.renderer.addClass(sidenavOverlay.item(0), 'd-none');
      }
    } else {
      this.handleBody(false);
    }
    
   /*  if ((toggle || sidenavOverlay) && this.router.url === '/email' && event.target.innerWidth > 767) {
      this.renderer.removeClass(toggle.item(0), 'show');
      this.renderer.removeClass(emailMenu.item(0), 'show');
      this.renderer.removeClass(sidenavOverlay.item(0), 'd-block');
      this.renderer.addClass(sidenavOverlay.item(0), 'd-none');
    } */
  }

  rightbar(event) {
    const toggle = document.getElementById('sidenav-overlay');
    if (event.currentTarget.className === 'sidenav-overlay d-block') {
      this.renderer.removeClass(toggle, 'd-block');
      this.document.body.classList.remove('menu-open');
      this.document.body.classList.add('menu-close');
      this.renderer.addClass(toggle, 'd-none');
    } else if (event.currentTarget.className === 'sidenav-overlay d-none') {
      this.renderer.removeClass(toggle, 'd-none');
      this.document.body.classList.remove('menu-close');
      this.document.body.classList.add('menu-open');
      this.renderer.addClass(toggle, 'd-block');
    }
  }

}

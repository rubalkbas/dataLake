import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavbarService } from '../../../_services/navbar.service';
import { ThemeSettingsService } from '../../settings/theme-settings.service';
import { MenuSettingsService } from '../../settings/menu-settings.service';
import { takeUntil } from 'rxjs/operators';
import { interval, Subject, Subscription } from 'rxjs';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AppConstants } from 'src/app/_helpers/app.constants';
import { NotificacionesService } from 'src/app/_services/notificaciones.service';
import { takeWhile } from 'rxjs/operators';
import { ServicioCompartido } from 'src/app/_services/servicioCompartido.service';
import { CentrosService } from 'src/app/_services/centros.service';
import { SettingsApp } from 'src/app/_common-model/settings-app';
import { LocalSesion } from 'src/app/_bussines-model/local-session';
import SessionJson from 'src/assets/local-sesion1.json';
import { AdminService } from 'src/app/_services/admin.service';
import { FuncionesPerfilService } from 'src/app/_services/funciones-perfil.service';

@Component({
  selector: 'app-header-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit, AfterViewInit {

  numeroNotificacion: any;
  notificacionesLista: any;
  insideTm: any;
  outsideTm: any;
  private _unsubscribeAll: Subject<any>;
  private _unsubscribeAllMenu: Subject<any>;
  public _themeSettingsConfig: any;
  private _menuSettingsConfig: any;
  public selectedHeaderNavBarClass: string;
  public selectedNavBarHeaderClass: string;
  public currentUser: any;
  public nombreCentro: any;
  public isHeaderSearchOpen: any;
  isMobile = false;
  showNavbar = false;
  public maximize: any;
  public search: any;
  public internationalization: any;
  public notification: any;
  public email: any;
  public config: PerfectScrollbarConfigInterface = { wheelPropagation: false };
  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective, { static: true }) directiveRef?: PerfectScrollbarDirective;
  clickEventSubscription: Subscription;

  constructor(
    private centroService: CentrosService,
    private notificacionesService: NotificacionesService,
    @Inject(DOCUMENT) private document: Document,
    private _renderer: Renderer2,
    private navbarService: NavbarService,
    private _themeSettingsService: ThemeSettingsService,
    private _menuSettingsService: MenuSettingsService,
    private tokenStorageService: TokenStorageService,
    private router: Router,

    private servicioCompartido: ServicioCompartido
  ) {
    this._unsubscribeAll = new Subject();
    this._unsubscribeAllMenu = new Subject();
    this.clickEventSubscription = this.servicioCompartido.getClickEvent().subscribe(() => {

      // console.log('llegando a las alertas se cargaron de nuevo')
      this.ngOnInit();
    })
  }
  count: number = 0;
  incrementCount() {
    this.count++;
    let usr = this.tokenStorageService.getUser();
    usr = usr.usuario;
    this.traerNotificaciones(usr);
  }

  logout() {
    if (this.currentUser.usuario) {

    }
  }

  irNotificacion() {
    this.router.navigate(['/portalSoluciones/alertas'])

  }

  ngOnInit() {

/*     if (SettingsApp.app.environment === 'LOCAL') {
      //==================================================
      console.info("VALIDA SESION LOCAL");
      let dataSesion: LocalSesion;
      dataSesion = SessionJson;
      console.info(dataSesion);
      this.funcionesPerfilService.cargaFuncionesRolAcceso(dataSesion);
      //==================================================

    } else {
      this._adminService.validaSesion().subscribe((data) => {
        console.info("VALIDA SESION  vertical DEVELOPMENT");
        console.info(data.response);

      })
    } */

    

    this.currentUser = this.tokenStorageService.getUser();
    this.obtenerCentro(this.currentUser.centroCostos);
    this.traerNotificaciones(this.currentUser.usuario);


    this.isMobile = window.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH;
    if (!this.isMobile) {
      this.showNavbar = true;
    }

    // Subscribe to config changes
    this._themeSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._themeSettingsConfig = config;
        this.refreshView();
      });
    this._menuSettingsService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this._menuSettingsConfig = config;
      });
    this.maximize = this._themeSettingsConfig.headerIcons.maximize;
    this.search = this._themeSettingsConfig.headerIcons.search;
    this.internationalization = this._themeSettingsConfig.headerIcons.internationalization;
    this.notification = this._themeSettingsConfig.headerIcons.notification;
    this.email = this._themeSettingsConfig.headerIcons.email;



   
  }

  obtenerCentro(id) {
    if (!this.nombreCentro) {
      this.centroService.centroPorId(id).subscribe(data => {
        this.nombreCentro = data.response.nombre;
      });
    } else {
      return false;
    }
  }

  obtNombreUsuario() {
    if (!this.currentUser) {
      if (this.tokenStorageService.getUserName()) {
        this.currentUser = this.tokenStorageService.getUser();

        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  //  Inicio de metodos de notificaciones

  traerNotificaciones(user) {

    this.notificacionesService.traerNotifNoLeidasUsuario(user).subscribe(data => {

      this.notificacionesLista = data.response;
      // // console.log('Lista Notificaciones');
      // console.log(this.notificacionesLista);

      let sum = 0;

      this.notificacionesLista.forEach(value => {
        sum = sum + 1;
        //// console.log(sum);
      });
      this.numeroNotificacion = sum;
      // console.log(this.numeroNotificacion);
    });
  }

  leerNotificacion(noti, asunto) {
    this.notificacionesService.leerNotificacion(noti).subscribe(data => {
      // console.log('Se cambio el status');
      this.traerNotificaciones(this.currentUser.usuario);
      this.router.navigate(['/portalSoluciones/detalleAsunto/' + asunto])
    });
  }

  //  fin de metodos de notificaciones
  ngAfterViewInit(): void {
    this.refreshView();
  }

  refreshView() {
    const iconElement = document.getElementsByClassName('toggle-icon');
    const menuColorElement = document.getElementsByClassName('main-menu');
    const navigationElement = document.getElementsByClassName('main-menu');
    const navbarElement = document.getElementsByClassName('header-navbar');
    const themeColorElement = document.getElementsByClassName('header-navbar');
    const element = document.getElementsByClassName('navbar-header');
    const boxelement = document.getElementById('customizer');





    if (themeColorElement) {
      if (this._themeSettingsConfig.colorTheme === 'semi-dark') {
        this._renderer.removeClass(themeColorElement.item(0), 'navbar-semi-light');
        this._renderer.removeClass(themeColorElement.item(0), 'navbar-dark');
        this._renderer.removeClass(themeColorElement.item(0), 'navbar-light');
      }
    }

    if (navigationElement) {
      if (this._themeSettingsConfig.navigation === 'menu-flipped') {
        this._renderer.addClass(document.body, 'menu-flipped');
      } else if (this._themeSettingsConfig.navigation === 'menu-collapsible') {
        this._renderer.addClass(navigationElement.item(0), 'menu-collapsible');
      }
    }

    if (navbarElement) {
      if (this._themeSettingsConfig.menu === 'navbar-static-top') {
        this._renderer.addClass(navbarElement.item(0), 'navbar-static-top');
        this._renderer.addClass(navigationElement.item(0), 'menu-static');
      }
    }

    if (navbarElement) {
      if (this._themeSettingsConfig.menu === 'semi-dark') {
        this._renderer.addClass(navbarElement.item(0), 'navbar-semi-dark');
      }
    }
  }

  resetOpenMenu() {
    for (let i = 0; i < this._menuSettingsConfig.vertical_menu.items.length; i++) {
      const menu = this._menuSettingsConfig.vertical_menu.items[i];
      if (!menu.submenu) {
        menu['isOpen'] = false;
        menu['isActive'] = false;
        menu['hover'] = false;
      } else if (menu.submenu) {
        for (let j = 0; j < menu.submenu.items.length; j++) {
          menu['isOpen'] = false;
          menu['isActive'] = false;
          menu['hover'] = false;
          menu.submenu.items[j]['isOpen'] = false;
        }
      }
    }
  }

  setOpenInNavbar(value) {
    for (let i = 0; i < this._menuSettingsConfig.vertical_menu.items.length; i++) {
      const menu = this._menuSettingsConfig.vertical_menu.items[i];
      if (!menu.submenu &&
        menu.page === this.router.url) {
        menu['isOpen'] = value;
        menu['isActive'] = value;
      } else if (menu.submenu) {
        for (let j = 0; j < menu.submenu.items.length; j++) {
          if (menu.submenu.items[j].page === this.router.url) {
            menu['isOpen'] = value;
            menu['isActive'] = value;
            menu.submenu.items[j]['isOpen'] = value;
            menu.submenu.items[j]['isActive'] = value;
            break;
          }
        }
      }
    }
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseEnter(e) {
    if (this.navbarService.isFixedMenu()) {
      return;
    }
    this.navbarService.setMouseInRegion(true);
    const navBar = this.document.getElementById('navbar-header');
    const mainMenu = this.document.getElementById('main-menu');

    // check if the left aside menu is fixed
    if (!navBar.classList.contains('expanded')) {
      this._renderer.addClass(navBar, 'expanded');
      this._renderer.addClass(mainMenu, 'expanded');
      this.resetOpenMenu();
      this.setOpenInNavbar(true);
    }
  }

  /**
   * Use for fixed left aside menu, to show menu on mouseenter event.
   * @param e Event
   */
  mouseLeave(event) {
    if (this.navbarService.isFixedMenu()) {
      return;
    }
    const _self = this;
    const navBar = this.document.getElementById('navbar-header');
    const mainMenu = this.document.getElementById('main-menu');
    if (navBar && navBar.classList.contains('expanded')) {
      this.insideTm = setTimeout(() => {
        if (!_self.navbarService.isMouseInRegion()) {
          this._renderer.removeClass(navBar, 'expanded');
          this._renderer.removeClass(mainMenu, 'expanded');
          this.resetOpenMenu();
          this.setOpenInNavbar(false);
        }
      }, 100);
    }
    this.navbarService.setMouseInRegion(false);
  }

  // example to update badge value dynamically from another component
  updateMenuBadgeValue() {
    for (let i = 0; i < this._menuSettingsConfig.items.length; i++) {
      if (this._menuSettingsConfig.items[i].badge) {
        this._menuSettingsConfig.items[i].badge.value = 19;
      }
    }
    this._menuSettingsService.config = this._menuSettingsConfig;
  }

  handleCollapseOfMenu(element) {
    if (element.classList && element.classList.contains('has-sub') && element.classList.contains('open')) {
      element.classList.remove('open');
      element.classList.remove('hover');
      element.classList.add('menu-collapsed-open');
    }
  }

  handleExpandOfMenu(element) {
    if (element.classList && element.classList.contains('has-sub') &&
      element.classList.contains('menu-collapsed-open')) {
      element.classList.remove('menu-collapsed-open');
      element.classList.add('open');
      element.classList.add('hover');
    }
  }

  toggleMenu(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const parent = target.parentElement;
    if (parent && parent.classList.contains('has-sub')) {
      this.openSubMenuUsingParent(parent);
    } else {
      const parentOfParent = parent.parentElement;
      this.openSubMenuUsingParent(parentOfParent);
    }
  }

  openSubMenuUsingParent(parent) {
    if (parent.classList && parent.classList.contains('has-sub') &&
      !parent.classList.contains('open')) {
      parent.classList.add('open');
    } else if (parent.classList && parent.classList.contains('has-sub') &&
      parent.classList.contains('open')) {
      parent.classList.remove('open');
    }
  }

  toggleFullScreen() {
    const toggleIcon = document.getElementsByClassName('ficon');

    if (toggleIcon.item(0).classList.contains('ft-maximize')) {
      this.openfullscreen();
      this._renderer.removeClass(toggleIcon.item(0), 'ft-maximize');
      this._renderer.addClass(toggleIcon.item(0), 'ft-minimize');
    } else if (toggleIcon.item(0).classList.contains('ft-minimize')) {
      this.closefullscreen();
      this._renderer.addClass(toggleIcon.item(0), 'ft-maximize');
      this._renderer.removeClass(toggleIcon.item(0), 'ft-minimize');
    }
  }

  openfullscreen() {
    // Trigger fullscreen
    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    let docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
  }

  closefullscreen() {
    // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
    let docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };
    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }

  }

  toggleFixMenu(e) {
    if (this.document.body.classList.contains('menu-expanded')) {
      // show the left aside menu
      this.navbarService.setFixedMenu(false);
      this.document.body.classList.remove('menu-expanded');
      this.document.body.classList.add('menu-collapsed');
      // Change switch icon
      this._themeSettingsConfig.menu = 'collapse';
    } else {
      this.navbarService.setFixedMenu(true);
      this.document.body.classList.remove('menu-collapsed');
      this.document.body.classList.add('menu-expanded');
      // Change switch icon
      this._themeSettingsConfig.menu = 'expand';
    }
    const navBar = this.document.getElementById('navbar-header');
    const mainMenu = this.document.getElementById('main-menu');
    this._renderer.addClass(navBar, 'expanded');
    this._renderer.addClass(mainMenu, 'expanded');
    setTimeout(() => { AppConstants.fireRefreshEventOnWindow(); }, 300);
  }

  toggleNavigation(e) {
    const sidenav = document.getElementById('sidenav-overlay');
    const sidebarLeft = document.getElementById('sidebar-left') || document.getElementById('email-app-menu') ||
      document.getElementById('sidebar-todo');
    const contentOverlay = document.getElementById('content-overlay');

    if (this.document.body.classList.contains('menu-open') && (
      this.router.url === '/busquedaAdmin'
      || this.router.url === '/portalSoluciones/busquedaAsuntosRe'
      || this.router.url === '/portalSoluciones/consultaAsunto'

      || this.router.url === '/portalSoluciones/consultaAsuntoPeticionario'

      || this.router.url === '/portalSoluciones/autoAyuda'
      || this.router.url === '/dataLake/catalogoDB'
      || this.router.url ===  '/dataLake/bitacora'

      || this.router.url === '/dataLake/catalogoStatus' 
      
    )) {
      this.document.body.classList.remove('menu-open');
      this._renderer.removeClass(sidenav, 'd-block');
      this._renderer.removeClass(contentOverlay, 'show');
      this.document.body.classList.add('menu-close');
      this._renderer.addClass(sidenav, 'd-none');
      this.showNavbar = false;
    } else if (this.document.body.classList.contains('menu-open')) {
      this.document.body.classList.remove('menu-open');
      this._renderer.removeClass(sidenav, 'd-block');
      this.document.body.classList.add('menu-close');
      this._renderer.addClass(sidenav, 'd-none');
      this.showNavbar = false;
    } else {
      this._renderer.removeClass(sidenav, 'd-none');
      this.document.body.classList.remove('menu-close');
      this.document.body.classList.add('menu-open');
      this._renderer.addClass(sidenav, 'd-block');
      this.showNavbar = false;
    }


  }

  toggleNavbar(e) {
    if (this.showNavbar) {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }

  public clickSearch() {
    if (this.isHeaderSearchOpen) {
      this.isHeaderSearchOpen = false;
    } else {
      this.isHeaderSearchOpen = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < AppConstants.MOBILE_RESPONSIVE_WIDTH) {
      this.isMobile = true;
      this.showNavbar = false;
    } else {
      this.isMobile = false;
      this.showNavbar = true;
    }
  }

}

import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css']
})
export class FullLayoutComponent implements OnInit {

  public showFooter = true;
  public showNavbar = true;

  constructor(private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    this.renderer.removeClass(document.body, 'vertical-overlay-menu');
    this.renderer.removeClass(document.body, 'bg-full-screen-image');
    this.renderer.removeClass(document.body, 'vertical-menu-modern');
    this.renderer.addClass(document.body, 'blank-page');
    this.renderer.addClass(document.body, 'pace-done');

    if ((this.router.url.indexOf('WithNavbar') >= 0) || (this.router.url.indexOf('Advanced') >= 0)) {
      this.showFooter = true;
      this.showNavbar = true;
      this.renderer.addClass(document.body, 'bg-cyan');
      this.renderer.addClass(document.body, 'bg-lighten-2');
      this.renderer.addClass(document.body, 'fixed-navbar');
      this.renderer.removeClass(document.body, 'blank-page');
    } else if (this.router.url.indexOf('Simple') >= 0) {
      this.showFooter = false;
      this.showNavbar = false;
      this.renderer.removeClass(document.body, 'fixed-navbar');
    }    else if (this.router.url.indexOf('unlockUser') >= 0 ) {
      this.showFooter = false;
      this.showNavbar = false;
      this.renderer.removeClass(document.body, 'fixed-navbar');
    }  
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

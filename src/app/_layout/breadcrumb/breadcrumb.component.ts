import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  constructor() {
     // This is intentional
   }

  @Input() breadcrumb: object;

  ngOnInit() {
    this.processBreadCrumbLinks();
  }
  private processBreadCrumbLinks() {
     // This is intentional
  }
}

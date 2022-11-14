
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DataLakeCatalogoService } from "src/app/_services/CatalogosDataLake.service";
import Swal from "sweetalert2";


@Component({
    selector: 'app-bitacora',
    templateUrl: './bitacora.component.html',
    styleUrls: ['./bitacora.component.scss']
  })
  
  export class BitacoraComponent implements OnInit {


    //displayedColumns: string[] = ['jobId','cronExpression','cronJob','descripcion','interfaceName','jobClass','jobGroup','jobName','jobStatus','jobTable','repeatTime','acciones'];
    displayedColumns: string[] = ['jobId','cronJob','descripcion','interfaceName','jobGroup','jobName','jobStatus','jobTable','repeatTime','acciones'];
    
    dataSource : any;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

    constructor(  public dialog: MatDialog ,
      private dataLakeCatalogoService:DataLakeCatalogoService) {

    }

    ngOnInit(): void {
      this.dataLakeCatalogoService.consultarBitacora().subscribe(data=>{

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
    
  }
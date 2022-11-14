import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { AuthGuard } from './_guards/auth.guard'; 
import { UsuariosComponent } from './componentes/admin/usuarios/usuarios.component';
import { RolesComponent } from './componentes/admin/roles/roles.component';
import { FuncionesComponent } from './componentes/admin/funciones/funciones.component';
 

const appRoutes: Routes = [
  // Public layout
/*   {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', component: LoginComponent }
    ]
  }, */
  // Private layout
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
     
          
      {
        path: 'portalSoluciones', loadChildren: () => import('../app/componentes/componentes.module').then(m => m.ComponentesModule)
      },
      { path: 'admin/usuarios', component: UsuariosComponent}, //, canActivate: [AuthGuard] },
      { path: 'admin/roles', component: RolesComponent}, //, canActivate: [AuthGuard] },
      { path: 'admin/funciones', component: FuncionesComponent}, //, canActivate: [AuthGuard] },
      {
        path: 'dataLake', loadChildren: () => import('../app/componentes/componentes.module').then(m => m.ComponentesModule) 
      },
    ],
    
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'changelog' }
];

export const routing = RouterModule.forRoot(appRoutes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' ,useHash: true });

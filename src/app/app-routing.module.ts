import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layouts/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
 { path: 'dashboard', component: LayoutComponent, loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '',  pathMatch: 'full', redirectTo: 'auth/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

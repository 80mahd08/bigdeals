import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';
import { LandingRedirectGuard } from './core/guards/landing-redirect.guard';

const routes: Routes = [
    {
        path: "auth",
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
        canActivate: [LandingRedirectGuard]
    },
    {
        path: "",
        loadChildren: () => import('./pages/visitor/visitor.module').then(m => m.VisitorModule),
        canActivate: [LandingRedirectGuard]
    },
    {
        path: "client",
        loadChildren: () => import('./pages/client/client.module').then(m => m.ClientModule),
        canActivate: [RoleGuard],
        data: { roles: ['CLIENT', 'ANNONCEUR'] }
    },
    {
        path: "announcer",
        loadChildren: () => import('./pages/announcer/announcer.module').then(m => m.AnnouncerModule),
        canActivate: [RoleGuard],
        data: { roles: ['ANNONCEUR', 'CLIENT'] }
    },
    {
        path: "admin",
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

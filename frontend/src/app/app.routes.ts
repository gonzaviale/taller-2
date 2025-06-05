import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '',
        component: HomeComponent,
        loadChildren: () => import('./modules/products/pages/products.routes').then(m => m.routes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
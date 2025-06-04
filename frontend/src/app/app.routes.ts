import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

    {
        path: '**',
        redirectTo: 'home'
    },

     {
        path: '',
       component : HomeComponent
    },
     {
        path:'products',
        loadChildren: ()=> import('./modules/products/pages/products.routes').then(p => p.routes)
    },

    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    }
    
   

];

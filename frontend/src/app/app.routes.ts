import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

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
        path: 'carrito',
        loadComponent: () => import('./pages/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
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
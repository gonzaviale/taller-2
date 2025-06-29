import { Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductsComponent } from './list-products/list-products.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'create-product',
                component: CreateProductComponent
            },
            {
                path: '',
                component: ListProductsComponent
            },
            {
                path: 'detail-product/:id',
                component: DetailProductComponent
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]

    }
]
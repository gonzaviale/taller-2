import { Routes } from '@angular/router';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductsComponent } from './list-products/list-products.component';

export const routes: Routes = [
    {
        path: '',
        children: [
          
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
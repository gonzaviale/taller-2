
import { Routes } from '@angular/router';
import { HomeComponent } from '../../../pages/home/home.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
// import productRouter from '../../../../../../backend/src/routes/productRouter';

export const routes: Routes = [


{
    path: '',
   children :[
    {
        path:'create-product',
        component : CreateProductComponent
    } ,
    {
        path:'list-prducts',
        component : ListProductsComponent
    } ,
    {
        path:'detail-prduct',
        component : DetailProductComponent
    } ,

   ]

}

]
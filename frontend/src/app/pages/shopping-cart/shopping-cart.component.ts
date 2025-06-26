import {  inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { CommonModule } from '@angular/common';
import { ProductDTO,ProductoCarrito} from '../../../types/ProductDTO';
import { ProductUtils } from '../../modules/products/pages/list-products/components/shared/product.utils'; 
import { CartsService } from '../../services/carts/carts.service';
import { CartDTO } from '../../../types/CartDTO';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  imports: [MenuComponent,CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  isLoading = false;
  total = 0;
  cart: CartDTO = { products: [], totalPrice: 0 };
   

 carritoService = inject(CartsService);

  ngOnInit(): void {
     this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.isLoading = true;
    this.carritoService.getCart().subscribe(cart => {   
      this.cart = cart;                    
      this.isLoading = false;
       console.log('Carrito completo:', JSON.stringify(cart, null, 2));
     // this.calcularTotal();
    });
  }



  eliminarDelCarrito(productId :number): void {
     this.carritoService.removeFromCart(productId);
      this.cargarCarrito();
    
  }
/*
  calcularTotal(): void {
    this.carritoService.obtenerTotal().subscribe(total => {
      this.total = total;
    });
  }
*/

tieneProductos(): boolean {
  return !this.isLoading && this.cart?.products?.length > 0;
}

  obtenerEstrellas(valor: number): string {
   return ProductUtils.getStars(valor);
  }

  obtenerIconoCategoria(categoria: string): string {
    return ProductUtils.getCategoryIcon(categoria);
   
  }

  obtenerNombreCategoria(categoria: string){
    return ProductUtils.getCategoryDisplayName(categoria);
  }

  onImageError(event: Event): void {
    return ProductUtils.handleImageError(event);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }


}

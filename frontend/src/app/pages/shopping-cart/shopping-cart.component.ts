import {  inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { CommonModule } from '@angular/common';
import { ProductDTO,ProductoCarrito} from '../../../types/ProductDTO';
import { ProductUtils } from '../../modules/products/pages/list-products/components/shared/product.utils'; 
import { CartsService } from '../../services/carts/carts.service';
import { CartDTO } from '../../../types/CartDTO';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  imports: [MenuComponent,CommonModule,RouterModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  isLoading = false;
  total = 0;
  cart: CartDTO = { products: [], totalPrice: 0 };
   
 carritoService = inject(CartsService);

  ngOnInit(): void {
     this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.carritoService.getCart().subscribe(cart => {   
      this.cart = cart;                    
      this.isLoading = false;
       
    });
  }

  eliminarDelCarrito(productId :number): void {
     this.carritoService.removeFromCart(productId);
      this.loadCart();
    
  }

  vaciarCarrito(){
    this.carritoService.clearCart();
  }

  finalizarCompra(){
    
  }

actualizarCantidad(productId: number, cambio: number): void {
  this.carritoService.cambiarCantidad(productId, cambio);
}

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

import {  inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { CommonModule } from '@angular/common';
import { CarritoService} from '../../services/carrito/carrito.service';
import { ProductDTO,ProductoCarrito} from '../../../types/ProductDTO';
import { ProductUtils } from '../../modules/products/pages/list-products/components/shared/product.utils'; 

@Component({
  selector: 'app-shopping-cart',
  imports: [MenuComponent,CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  isLoading = false;
  total = 0;
  products: ProductoCarrito[] = [];
   

 carritoService = inject(CarritoService);

  ngOnInit(): void {
     this.cargarCarrito();
  }

 cargarCarrito(): void {
    this.isLoading = true;
    this.carritoService.obtenerProductos().subscribe(items => {
      this.products = items;
      this.isLoading = false;
      this.calcularTotal();
    });
  }

  eliminarDelCarrito(item: ProductDTO): void {
     this.carritoService.eliminarProducto(item);
      this.cargarCarrito();
    
  }

  calcularTotal(): void {
    this.carritoService.obtenerTotal().subscribe(total => {
      this.total = total;
    });
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

import {  inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { CommonModule } from '@angular/common';
import { CarritoService} from '../../services/carrito/carrito.service';
import { ProductDTO,ProductoCarrito} from '../../../types/ProductDTO';

@Component({
  selector: 'app-shopping-cart',
  imports: [MenuComponent,CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  isLoading = false;
  total = 0;
  carritoItems: ProductoCarrito[] = [];

 carritoService = inject(CarritoService);

  ngOnInit(): void {
     this.cargarCarrito();
  }

 cargarCarrito(): void {
    this.isLoading = true;
    this.carritoService.obtenerProductos().subscribe(items => {
      this.carritoItems = items;
      this.isLoading = false;
      this.calcularTotal();
    });
  }

  eliminarDelCarrito(item: ProductoCarrito): void {
    this.carritoService.eliminarProducto(item).subscribe(() => {
      this.cargarCarrito();
    });
  }

  calcularTotal(): void {
    this.carritoService.obtenerTotal().subscribe(total => {
      this.total = total;
    });
  }

  obtenerEstrellas(valor: number): string {
    const estrellasLlenas = '★'.repeat(Math.floor(valor));
    const estrellasVacias = '☆'.repeat(5 - Math.floor(valor));
    return estrellasLlenas + estrellasVacias;
  }

  obtenerIconoCategoria(categoria: string): string {
    switch (categoria) {
      case 'electronica': return '🔌';
      case 'libros': return '📚';
      case 'ropa': return '👕';
      default: return '🛒';
    }
  }

  obtenerNombreCategoria(categoria: string): string {
    switch (categoria) {
      case 'electronica': return 'Electrónica';
      case 'libros': return 'Libros';
      case 'ropa': return 'Ropa';
      default: return 'Otros';
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }


}

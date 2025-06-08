import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable ,of } from 'rxjs';
import { ProductDTO, ProductsResponse ,ProductoCarrito} from '../../../types/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private productosEnCarrito: ProductoCarrito[] = [
    {
      id: 1,
      title: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido.',
      price: 79.99,
      quantity: 2,
      image: 'https://via.placeholder.com/300x200',
      category: 'electronica',
      ratingRate: 4.5,
      ratingCount: 120
    },
    {
      id: 2,
      title: 'Libro: Aprende Angular',
      description: 'Guía completa para aprender Angular paso a paso.',
      price: 29.99,
      quantity: 1,
      image: 'https://via.placeholder.com/300x200',
      category: 'libros',
      ratingRate: 4.8,
      ratingCount: 85
    }
  ];

  constructor() {}

  // Obtener todos los productos del carrito
  obtenerProductos(): Observable<ProductoCarrito[]> {
    return of(this.productosEnCarrito);
  }

  // Eliminar un producto del carrito
  eliminarProducto(producto: ProductoCarrito): Observable<boolean> {
    this.productosEnCarrito = this.productosEnCarrito.filter(p => p.id !== producto.id);
    return of(true);
  }

  // Calcular el total del carrito
  obtenerTotal(): Observable<number> {
    const total = this.productosEnCarrito.reduce((suma, p) => suma + (p.price * p.quantity), 0);
    return of(total);
  }

  // Agregar un producto (extra opcional)
  agregarProducto(producto: ProductoCarrito): Observable<boolean> {
    const existente = this.productosEnCarrito.find(p => p.id === producto.id);
    if (existente) {
      existente.quantity += producto.quantity;
    } else {
      this.productosEnCarrito.push(producto);
    }
    return of(true);
  }

  // Vaciar carrito (opcional)
  vaciarCarrito(): Observable<boolean> {
    this.productosEnCarrito = [];
    return of(true);
  }
}



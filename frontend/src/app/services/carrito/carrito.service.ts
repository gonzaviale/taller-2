import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject,Observable ,of } from 'rxjs';
import { ProductDTO, ProductsResponse ,ProductoCarrito} from '../../../types/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  private cart = this.cartSubject.getValue();

  constructor() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      const parsed = JSON.parse(carritoGuardado) as ProductoCarrito[];
      this.cartSubject.next(parsed);
  }
  }
  // Obtener todos los productos del carrito
  obtenerProductos(): Observable<ProductoCarrito[]> {
     
    return this.cartSubject.asObservable();
  }

  // Eliminar un producto del carrito
  eliminarProducto(producto: ProductDTO): void {
      const currentCart = this.cartSubject.getValue();
  const updatedCart = currentCart.filter(item => item.id !== producto.id);

  this.cartSubject.next(updatedCart);
  localStorage.setItem('carrito', JSON.stringify(updatedCart));
  }

  // Calcular el total del carrito
  obtenerTotal(): Observable<number> {
    const total = this.cart.reduce((suma, p) => suma + (p.price * p.quantity), 0);
    return of(total);
  }

  // Agregar un producto 
  agregarProducto(product: ProductDTO ,quantity : number): void {
     const currentCart = this.cartSubject.getValue();
      const index = currentCart.findIndex(p => p.id === product.id);

    let updatedCart: ProductoCarrito[];

    if (index !== -1) {
      updatedCart = [...currentCart];
      updatedCart[index].quantity += quantity;
    } else {
      updatedCart = [...currentCart, { ...product, quantity }];
    }

    this.cartSubject.next(updatedCart);
    localStorage.setItem('carrito', JSON.stringify(updatedCart));
  }
  
    clearCart(): void {
    this.cart = [];
  }
  }
  





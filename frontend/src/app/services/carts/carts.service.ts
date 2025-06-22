import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CartDTO, PurchaseDTO, PurchaseRequest, PurchaseResponse } from '../../../types/CartDTO';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  constructor() { }

  http = inject(HttpClient);
  authService = inject(AuthService);
  apiUrl = environment.api_url;

  // crear un carrito singleton para que no se pierda al refrescar la pagina
  private cart: CartDTO = {
    products: [],
    totalPrice: 0
  }

  getCart(): CartDTO {
    return this.cart;
  }

  addToCart(product: CartDTO['products'][number]): void {
    const existingProduct = this.cart.products.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.cart.products.push(product);
    }
    this.updateTotalPrice();
  }

  removeFromCart(productId: number): void {
    this.cart.products = this.cart.products.filter(p => p.id !== productId);
    this.updateTotalPrice();
  }

  private updateTotalPrice(): void {
    this.cart.totalPrice = this.cart.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }
  
  clearCart(): void {
    this.cart.products = [];
    this.cart.totalPrice = 0;
  }

  createPurchase(purchase: PurchaseRequest): Observable<PurchaseDTO> {
    const userId = Number(this.authService.getUserId());
    if (!userId) {
      throw new Error('User ID is required to create a purchase');
    }
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication token is required to create a purchase');
    }
    purchase.userId = userId;
    return this.http.post<PurchaseDTO>(`${this.apiUrl}/purchase`, purchase);
  }

  updatePurchase(id: number, purchase: PurchaseDTO): Observable<PurchaseDTO> {
    return this.http.put<PurchaseDTO>(`${this.apiUrl}/purchase/${id}`, purchase);
  }

  deleteCart(id: number): Observable<PurchaseDTO> {
    return this.http.delete<PurchaseDTO>(`${this.apiUrl}/purchase/${id}`);
  }
}

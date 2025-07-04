import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CartDTO, PurchaseDTO, PurchaseRequest, PurchaseResponse, StatusPurchase } from '../../../types/CartDTO';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProductDTO } from '../../../../../backend/src/types/DTO';
import { Purchase } from '../../../../../backend/src/models/Purchase';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CartsService {

  http = inject(HttpClient);
  authService = inject(AuthService);
  apiUrl = environment.api_url;
  private readonly STORAGE_KEY = 'miCarrito';

  constructor() {

    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }

  }

  // crear un carrito singleton para que no se pierda al refrescar la pagina
  private cart: CartDTO = {
    products: [],
    totalPrice: 0
  }

  getCart(): Observable<CartDTO> {
    return of(this.cart);
  }

  addToCart(product: CartDTO['products'][number]): void {
    const existingProduct = this.cart.products.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.cart.products.push(product);
    }
    this.updateTotalPrice();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));

  }

  cambiarCantidad(productId: number, cambio: number): void {
    const producto = this.cart.products.find(p => p.id === productId);
    if (!producto) return;

    const nuevaCantidad = producto.quantity + cambio;
    // Evitar cantidades menores a 1
    if (nuevaCantidad < 1) return;
    producto.quantity = nuevaCantidad;

    this.updateTotalPrice();
    localStorage.setItem('miCarrito', JSON.stringify(this.cart));

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
    localStorage.removeItem(this.STORAGE_KEY);
    this.cart.products = [];
    this.cart.totalPrice = 0;
   
  }

  createPurchaseRequeset(): Observable<PurchaseDTO> {

    const userId = Number(this.authService.getUserId());
    if (!userId) {
      throw new Error('User ID is required to create a purchase');
    }

    const purchaseRequest = this.mapCartToPurchaseRequest(this.cart, userId);
    return this.createPurchase(purchaseRequest);
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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<PurchaseDTO>(`${this.apiUrl}/purchase`, purchase, { headers });
  }

  updatePurchase(id: number, purchase: PurchaseDTO): Observable<PurchaseDTO> {
    return this.http.put<PurchaseDTO>(`${this.apiUrl}/purchase/${id}`, purchase);
  }

  deleteCart(id: number): Observable<PurchaseDTO> {
    return this.http.delete<PurchaseDTO>(`${this.apiUrl}/purchase/${id}`);
  }

  mapCartToPurchaseRequest(cart: CartDTO, userId: number): PurchaseRequest {
    const purchaseRequest: PurchaseRequest = {
      userId: userId,
      products: cart.products,
      status: 'buying'

    };
    return purchaseRequest;

  }

  getUserPurchases(): Observable<PurchaseDTO[]> {
  const token = this.authService.getToken();
  
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get<PurchaseDTO[]>(`${this.apiUrl}/purchase/mis-compras`, { headers });

}


}

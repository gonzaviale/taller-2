import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CartDTO, PurchaseDTO, PurchaseRequest, PurchaseResponse, StatusPurchase } from '../../../types/CartDTO';
import { map, Observable, of } from 'rxjs';
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


  constructor() {


  }

  // crear un carrito singleton para que no se pierda al refrescar la pagina


  private cart: CartDTO = {
    products: [],
    totalPrice: 0
  }

  private cartsByUserId: Record<number, CartDTO> = {};



  getCart(): Observable<CartDTO> {
    try {
      const cart = this.getCurrentCart(); // ya obtiene carrito solo para userId actual
      return of(cart);
    } catch (error) {
      // En caso de que no haya userId (usuario no autenticado)
      return of({ products: [], totalPrice: 0 });
    }
  }

  private getCurrentUserId(): number {
    const userId = Number(this.authService.getUserId());
    if (!userId) throw new Error('Usuario no autenticado');
    return userId;
  }

  private getCurrentCart(): CartDTO {
    const userId = this.getCurrentUserId();
    if (!this.cartsByUserId[userId]) {
      this.cartsByUserId[userId] = { products: [], totalPrice: 0 };
    }
    return this.cartsByUserId[userId];
  }

  addToCart(product: CartDTO['products'][number]): void {
    const cart = this.getCurrentCart();
    const existingProduct = cart.products.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.products.push(product);
    }
    this.updateTotalPrice(cart);
  }

  cambiarCantidad(productId: number, cambio: number): void {
    const cart = this.getCurrentCart();
    const producto = cart.products.find(p => p.id === productId);
    if (!producto) return;

    const nuevaCantidad = producto.quantity + cambio;
    if (nuevaCantidad < 1) return;
    producto.quantity = nuevaCantidad;

    this.updateTotalPrice(cart);
  }

  removeFromCart(productId: number): void {
    const cart = this.getCurrentCart();
    cart.products = cart.products.filter(p => p.id !== productId);
    this.updateTotalPrice(cart);
  }

  private updateTotalPrice(cart: CartDTO): void {
    cart.totalPrice = cart.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  }

  clearCart(): void {
    const userId = this.getCurrentUserId();
    delete this.cartsByUserId[userId];
  }

  createPurchaseRequeset(): Observable<PurchaseDTO> {
    const userId = this.getCurrentUserId();
    const cart = this.getCurrentCart();

    if (!userId) {
      throw new Error('usuario no autenticado.');
    }


    if (!cart || cart.totalPrice === 0) {
      throw new Error('Cart is empty. Cannot create a purchase.');
    }

    const purchaseRequest = this.mapCartToPurchaseRequest(cart, userId);

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

  getUserPurchases(): Observable<PurchaseResponse> {
    const token = this.authService.getToken();
    const currentUserId = this.getCurrentUserId();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<PurchaseResponse>(`${this.apiUrl}/purchase`, { headers }).pipe(
      map((response: PurchaseResponse) => {
        const filteredPurchases = response.purchases.filter(p => p.userId === currentUserId);
        return {
          ...response,
          purchases: filteredPurchases,
          totalItems: filteredPurchases.length,
          // Si no usás paginación, podés setear:
          currentPage: 1,
          totalPages: 1,
        };
      })
    );
  }

}

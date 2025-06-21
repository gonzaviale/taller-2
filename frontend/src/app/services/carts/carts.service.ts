import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CartDTO, CartResponse } from '../../../types/CartDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = environment.api_url;

  getCarts(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/cart`);
  }

  getCartById(id: number): Observable<CartDTO> {
    return this.http.get<CartDTO>(`${this.apiUrl}/cart/${id}`);
  }

  createCart(cart: CartDTO): Observable<CartDTO> {
    return this.http.post<CartDTO>(`${this.apiUrl}/cart`, cart);
  }

  updateCart(id: number, cart: CartDTO): Observable<CartDTO> {
    return this.http.put<CartDTO>(`${this.apiUrl}/cart/${id}`, cart);
  }

  deleteCart(id: number): Observable<CartDTO> {
    return this.http.delete<CartDTO>(`${this.apiUrl}/cart/${id}`);
  }
}

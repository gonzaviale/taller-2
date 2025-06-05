import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductDTO } from '../../../types/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = environment.api_url;

  getProducts(): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/product`);
  }
  getProductById(id: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/product/${id}`);
  }
  createProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.apiUrl}/product`, product);
  }
  updateProduct(id: string, product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/product/${id}`, product);
  }
  deleteProduct(id: string): Observable<ProductDTO> {
    return this.http.delete<ProductDTO>(`${this.apiUrl}/product/${id}`);
  }
}

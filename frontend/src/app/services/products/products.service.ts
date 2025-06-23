import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductDTO, ProductsResponse } from '../../../types/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = environment.api_url;

  getProducts(
    page: number = 1,
    limit: number = 10,
    title: string = '',
    category: string = '',
    priceMax: string = '',
    priceMin: string = '',
    sort: string = 'default'
  ): Observable<ProductsResponse> {
    // Agregar los parametros de consulta a la query
    const params: any = {
      page,
      limit,
      title,
      category,
      priceMax,
      priceMin,
      sort
    };
    // Eliminar los parametros que no tienen valor
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key];
      }
    });
    return this.http.get<ProductsResponse>(`${this.apiUrl}/product`, { params });
  }
  getProductById(id: number): Observable<ProductDTO> {
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

import { Component, inject, OnInit } from '@angular/core';
import { ProductDTO } from '../../../../../types/ProductDTO';
import { ProductsService } from '../../../../services/products/products.service';

@Component({
  selector: 'app-list-products',
  imports: [],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent implements OnInit {

  products: ProductDTO[] = [];
  productService = inject(ProductsService);

  ngOnInit(): void { 
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (product: ProductDTO) => {
        this.products = [product];
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}

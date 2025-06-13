import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductDTO } from '../../../../../types/ProductDTO';
import { ProductsService } from '../../../../services/products/products.service';
import { ProductUtils } from '../list-products/components/shared/product.utils';

@Component({
  selector: 'app-detail-product',
  imports: [CommonModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private productService = inject(ProductsService);

  product: ProductDTO | null = null;
  quantity: number = 1;

  ngOnInit() {
    // el id se saca de la ruta
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error al cargar el producto:', error);
        this.product = null; 
      },
      complete: () => {
        console.log('Carga del producto completada');
      }
    });
  }

  getCategoryDisplayName(category: string): string {
    return ProductUtils.getCategoryDisplayName(category);
  }

  getCategoryIcon(category: string): string {
    return ProductUtils.getCategoryIcon(category);
  }

  getStars(rating: number): string {
    return ProductUtils.getStars(rating);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  onAddToCart(product: ProductDTO) {
    /**@todo: agregar la logica */
    console.log(`Agregando ${this.quantity} unidades de ${product.title} al carrito`);
  }

  onBuyNow(product: ProductDTO) {
    /**@todo: agregar la logica */
    console.log(`Comprando ${this.quantity} unidades de ${product.title}`);
  }

  onImageError(event: any) {
    ProductUtils.handleImageError(event);
  }

  goBack() {
    this.location.back();
  }
}

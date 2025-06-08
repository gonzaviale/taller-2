import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../../../../../../types/ProductDTO';
import { ProductUtils } from '../shared/product.utils';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent {
  @Input() products: ProductDTO[] = [];
  @Output() addToCart = new EventEmitter<ProductDTO>();

  onAddToCart(product: ProductDTO): void {
    this.addToCart.emit(product);
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

  onImageError(event: Event): void {
    ProductUtils.handleImageError(event);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }
}

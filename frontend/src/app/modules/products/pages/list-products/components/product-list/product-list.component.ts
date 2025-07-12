import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../../../../../../types/ProductDTO';
import { ProductUtils } from '../shared/product.utils';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
})

export class ProductListComponent {

  @Input() products: ProductDTO[] = [];
  @Output() addToCart = new EventEmitter<ProductDTO>();
  private router = inject(Router);


  onAddToCart(product: ProductDTO, event?: Event) {
    this.addToCart.emit(product);

    if (event) {
      event.stopPropagation();
    }

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

  onProductClick(product: ProductDTO) {
    this.router.navigate(['/detail-product', product.id]);
  }


  onViewDetails(product: ProductDTO, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/detail-product', product.id]);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../../../../../../types/ProductDTO';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input() products: ProductDTO[] = [];
  @Output() addToCart = new EventEmitter<ProductDTO>();

  onAddToCart(product: ProductDTO): void {
    this.addToCart.emit(product);
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'electronics': 'Electrónicos',
      'jewelery': 'Joyería',
      "men's clothing": 'Ropa Hombre',
      "women's clothing": 'Ropa Mujer'
    };
    return categoryMap[category] || category;
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'electronics': '📱',
      'jewelery': '💎',
      "men's clothing": '👔',
      "women's clothing": '👗'
    };
    return iconMap[category] || '🏷️';
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '');
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }
}

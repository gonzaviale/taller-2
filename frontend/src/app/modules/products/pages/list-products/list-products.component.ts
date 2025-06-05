import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDTO, ProductsResponse } from '../../../../../types/ProductDTO';
import { ProductsService } from '../../../../services/products/products.service';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent implements OnInit {
  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  categories: string[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  sortBy: string = 'default';
  viewMode: 'grid' | 'list' = 'grid';

  isLoading: boolean = true;
  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  productService = inject(ProductsService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.extractCategories();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.showMessageToUser('Error al cargar los productos', 'error');
      }
    });
  }

  private extractCategories(): void {
    const uniqueCategories = [...new Set(this.products.map(p => p.category))];
    this.categories = uniqueCategories.filter(Boolean);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.selectedPriceRange) {
      filtered = this.applyPriceFilter(filtered);
    }

    filtered = this.applySorting(filtered);

    this.filteredProducts = filtered;
  }

  private applyPriceFilter(products: ProductDTO[]): ProductDTO[] {
    switch (this.selectedPriceRange) {
      case '0-50':
        return products.filter(p => p.price <= 50);
      case '50-100':
        return products.filter(p => p.price > 50 && p.price <= 100);
      case '100-500':
        return products.filter(p => p.price > 100 && p.price <= 500);
      case '500+':
        return products.filter(p => p.price > 500);
      default:
        return products;
    }
  }

  private applySorting(products: ProductDTO[]): ProductDTO[] {
    switch (this.sortBy) {
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      case 'rating':
        return products.sort((a, b) => (b.ratingRate || 0) - (a.ratingRate || 0));
      case 'name':
        return products.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return products;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.sortBy = 'default';
    this.applyFilters();
    this.showMessageToUser('Filtros limpiados', 'success');
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
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

  addToCart(product: ProductDTO): void {
    console.log('Adding to cart:', product);
    this.showMessageToUser(`${product.title} agregado al carrito`, 'success');
  }

  private showMessageToUser(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
  }
}
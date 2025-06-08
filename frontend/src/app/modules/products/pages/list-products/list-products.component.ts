import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDTO, ProductsResponse } from '../../../../../types/ProductDTO';
import { ProductsService } from '../../../../services/products/products.service';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoadingStateComponent } from './components/loading-state/loading-state.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { MessageNotificationComponent } from './components/message-notification/message-notification.component';

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedPriceRange: string;
  sortBy: string;
}

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductFiltersComponent,
    ProductGridComponent,
    ProductListComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    MessageNotificationComponent
  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent implements OnInit {
  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  categories: string[] = [];

  filterState: FilterState = {
    searchTerm: '',
    selectedCategory: '',
    selectedPriceRange: '',
    sortBy: 'default'
  };

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

  onFiltersChange(filters: FilterState): void {
    this.filterState = { ...filters };
    this.applyFilters();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onClearFilters(): void {
    this.filterState = {
      searchTerm: '',
      selectedCategory: '',
      selectedPriceRange: '',
      sortBy: 'default'
    };
    this.applyFilters();
    this.showMessageToUser('Filtros limpiados', 'success');
  }

  private applyFilters(): void {
    let filtered = [...this.products];

    if (this.filterState.searchTerm.trim()) {
      const searchLower = this.filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    if (this.filterState.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.filterState.selectedCategory);
    }

    if (this.filterState.selectedPriceRange) {
      filtered = this.applyPriceFilter(filtered);
    }

    filtered = this.applySorting(filtered);
    this.filteredProducts = filtered;
  }

  private applyPriceFilter(products: ProductDTO[]): ProductDTO[] {
    switch (this.filterState.selectedPriceRange) {
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
    switch (this.filterState.sortBy) {
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

  onAddToCart(product: ProductDTO): void {
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
}
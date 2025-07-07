import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriceRange, ProductDTO, ProductsResponse } from '../../../../../types/ProductDTO';
import { ProductsService } from '../../../../services/products/products.service';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoadingStateComponent } from './components/loading-state/loading-state.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { MessageNotificationComponent } from './components/message-notification/message-notification.component';
import { ProductUtils } from './components/shared/product.utils';
import { ProductCartDTO } from '../../../../../types/CartDTO';
import { CartsService } from '../../../../services/carts/carts.service';
import { AuthService } from '../../../../services/auth/auth.service';

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
  cartService = inject(CartsService);
  authService = inject (AuthService);

  ngOnInit(): void {
    // CARGA LOS FILTROS GUARDADOS EN LOCAL STORAGE
    const savedFilters = localStorage.getItem('filterState');
    if (savedFilters) {
      this.filterState = JSON.parse(savedFilters);
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.extractCategories();
    this.applyFilters();
  }

  private extractCategories(): void {
    this.categories = ProductUtils.getCategories();
  }

  onFiltersChange(filters: FilterState): void {
    this.filterState = { ...filters };
    // FEATURE PEDIDA POR JOEL GUARDAR EN LOCAL STORAGE LOS FILTROS
    localStorage.setItem('filterState', JSON.stringify(this.filterState));
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
    // LIMPIA EL LOCAL STORAGE DE LOS FILTROS
    localStorage.removeItem('filterState');
    this.applyFilters();
    this.showMessageToUser('Filtros limpiados', 'success');
  }

  private applyFilters(): void {

    let filtersParams = {
      page: 1,
      limit: 10,
      title: this.filterState.searchTerm || '',
      category: this.filterState.selectedCategory || '',
      priceMax: this.filterState.selectedPriceRange !== ''
        ? this.applyPriceFilter(this.filterState.selectedPriceRange).priceMax
        : '',
      priceMin: this.filterState.selectedPriceRange !== ''
        ? this.applyPriceFilter(this.filterState.selectedPriceRange).priceMin
        : '',
      sort: this.filterState.sortBy || 'default'
    }

    this.productService.getProducts(
      filtersParams.page,
      filtersParams.limit,
      filtersParams.title,
      filtersParams.category,
      filtersParams.priceMax,
      filtersParams.priceMin,
      filtersParams.sort
    ).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.filteredProducts = response.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
        this.isLoading = false;
        this.showMessageToUser('Error al cargar los productos', 'error');
      }
    });
  }

  private applyPriceFilter(selectedPriceRange: string): PriceRange {
    switch (selectedPriceRange) {
      case '0-50':
        return { priceMin: "0", priceMax: "50" };
      case '50-100':
        return { priceMin: "50", priceMax: "100" };
      case '100-500':
        return { priceMin: "100", priceMax: "500" };
      case '500+':
        return { priceMin: "500", priceMax: "" };
      default:
        return { priceMin: "0", priceMax: "" };
    }
  }

  onAddToCart(product: ProductDTO): void {

    const cartProduct: ProductCartDTO = this.productDTOtoCartProductDTO(product);

    if (this.authService.getUserId() != null) {
      this.cartService.addToCart(cartProduct);
      this.showMessageToUser(`${product.title} agregado al carrito`, 'success');
    } else {
      this.showMessageToUser(`login requerido para agregar al carrito`, 'error');
    }
  }

  private showMessageToUser(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }


  private productDTOtoCartProductDTO(product: ProductDTO): ProductCartDTO {
    return {
      id: product.id!,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      quantity: 1
    };
  }

}
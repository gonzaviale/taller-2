import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductUtils } from '../shared/product.utils';

export interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedPriceRange: string;
  sortBy: string;
}

@Component({
  selector: 'app-product-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.css'
})
export class ProductFiltersComponent {
  @Input() categories: string[] = [];
  @Input() filterState!: FilterState;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() totalProducts: number = 0;
  @Input() filteredProductsCount: number = 0;

  @Output() filtersChange = new EventEmitter<FilterState>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();
  @Output() clearFilters = new EventEmitter<void>();

  localFilterState: FilterState = {
    searchTerm: '',
    selectedCategory: '',
    selectedPriceRange: '',
    sortBy: 'default'
  };

  ngOnInit(): void {
    this.localFilterState = { ...this.filterState };
  }

  ngOnChanges(): void {
    this.localFilterState = { ...this.filterState };
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.localFilterState });
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewModeChange.emit(mode);
  }

  getCategoryDisplayName(category: string): string {
    return ProductUtils.getCategoryDisplayName(category);
  }
}

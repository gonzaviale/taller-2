import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() type: 'no-results' | 'no-products' = 'no-results';
  @Output() clearFilters = new EventEmitter<void>();

  onClearFilters(): void {
    this.clearFilters.emit();
  }
}

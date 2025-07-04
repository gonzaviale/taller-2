import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartsService } from '../../services/carts/carts.service';
import { PurchaseDTO } from '../../../types/CartDTO';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-mis-compras',
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
})
export class MisComprasComponent implements OnInit {
  private carritoService = inject(CartsService);
  private authService = inject(AuthService);

  compras: PurchaseDTO[] = [];
  isLoading = false;
  error = '';

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.isLoading = true;
    this.carritoService.getUserPurchases().subscribe({
    next: (purchases) => this.compras = purchases,
    error: (err) => this.error = err.message
});

  }
}

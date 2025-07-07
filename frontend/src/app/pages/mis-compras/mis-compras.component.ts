import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartsService } from '../../services/carts/carts.service';
import { PurchaseDTO } from '../../../types/CartDTO';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Purchase } from '../../../../../backend/src/models/Purchase';
import { PurchaseResponse, ProductCartDTO } from '../../../types/CartDTO';
import { MenuComponent } from '../../layouts/menu/menu.component';


@Component({
  selector: 'app-mis-compras',
  imports: [CommonModule, RouterModule,MenuComponent],
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
})
export class MisComprasComponent implements OnInit {
  private carritoService = inject(CartsService);
  private authService = inject(AuthService);

  purchaseResponse: PurchaseResponse | undefined ;
  isLoading = false;
  error = '';

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      return;
    }

    this.isLoading = true;
    this.carritoService.getUserPurchases().subscribe({
      next: (response) => {

        console.log(response)
        this.purchaseResponse = response
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }


  groupProducts(products: ProductCartDTO[]): ProductCartDTO[] {
    const map = new Map<number, ProductCartDTO>();

    products.forEach(prod => {
      if (map.has(prod.id!)) {
        const existing = map.get(prod.id!)!;
        existing.quantity = (existing.quantity || 1) + (prod.quantity || 1);
      } else {
        map.set(prod.id!, { ...prod, quantity: prod.quantity || 1 });
      }
    });

    return Array.from(map.values());
  }


}

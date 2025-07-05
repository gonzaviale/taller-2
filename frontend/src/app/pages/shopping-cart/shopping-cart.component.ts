import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { CommonModule } from '@angular/common';
import { ProductDTO, ProductoCarrito } from '../../../types/ProductDTO';
import { ProductUtils } from '../../modules/products/pages/list-products/components/shared/product.utils';
import { CartsService } from '../../services/carts/carts.service';
import { CartDTO } from '../../../types/CartDTO';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageNotificationComponent } from '../../modules/products/pages/list-products/components/message-notification/message-notification.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [MenuComponent, CommonModule, RouterModule, MessageNotificationComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  isLoading = false;
  total = 0;
  cart: CartDTO = { products: [], totalPrice: 0 };

  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  carritoService = inject(CartsService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService)
  private router = inject(Router);

  ngOnInit(): void {
    const userId = this.authService.getUserId();
     if (!userId) {
       this.router.navigate(['/login']); 
    return;
   
  }
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.carritoService.getCart().subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;

    });
  }

  eliminarDelCarrito(productId: number): void {
    this.carritoService.removeFromCart(productId);
    this.loadCart();

  }

  vaciarCarrito() {
    this.carritoService.clearCart();
    this.showMessageToUser('Carrito eliminado', 'success');
  }

  finalizarCompra() {

    this.carritoService.createPurchaseRequeset().subscribe({
      next: (res) => {
        this.carritoService.clearCart();
        this.loadCart();
        this.showMessageToUser('Compra realizada con éxito', 'success');
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Error al realizar la compra.';
        this.showMessageToUser(errorMsg, 'error');
      }
    });
  }

  actualizarCantidad(productId: number, cambio: number): void {
    this.carritoService.cambiarCantidad(productId, cambio);
  }

  tieneProductos(): boolean {
    return !this.isLoading && this.cart?.products?.length > 0;
  }

  obtenerEstrellas(valor: number): string {
    return ProductUtils.getStars(valor);
  }

  obtenerIconoCategoria(categoria: string): string {
    return ProductUtils.getCategoryIcon(categoria);

  }

  obtenerNombreCategoria(categoria: string) {
    return ProductUtils.getCategoryDisplayName(categoria);
  }

  onImageError(event: Event): void {
    return ProductUtils.handleImageError(event);
  }

  trackByProductId(index: number, product: ProductDTO): number {
    return product.id || index;
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

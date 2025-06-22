import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn = false;
  isDropdownOpen = false;
  cartItemCount = 0;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.checkAuthStatus();
    this.loadCartItemCount();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  loadCartItemCount() {
    this.cartItemCount = 0;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToMisCompras() {
    this.closeDropdown();
    // this.router.navigate(['/mis-compras']);
  }

  navigateToMiPerfil() {
    this.closeDropdown();
    // this.router.navigate(['/mi-perfil']);
  }

  navigateToCarrito() {
    // this.router.navigate(['/carrito']);
  }

  cerrarSesion() {
    this.authService.logout();
    
    // Actualizar estado del componente
    this.isLoggedIn = false;
    this.closeDropdown();
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
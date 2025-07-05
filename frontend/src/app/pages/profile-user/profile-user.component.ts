import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserDTO } from '../../../types/UserDTO';
import { Router } from '@angular/router';
import { MenuComponent } from '../../layouts/menu/menu.component';


@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule ,MenuComponent],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css' // o .scss
})
export class PerfilUsuarioComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: UserDTO = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: ''
  };

  confirmPassword: string = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  ngOnInit(): void {

    const userId = this.authService.getUserId();
  if (!userId) {
    this.router.navigate(['/login']);
    return;
  }

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = { ...data, password: '' }; // Evita mostrar el password
      },
      error: () => {
        this.errorMessage = 'Error al cargar el perfil';
      }
    });
  }

  onUpdate(): void {
    this.clearMessages();

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    this.authService.updateProfile(this.user).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente.';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al actualizar el perfil.';
        this.isLoading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.user.firstName.trim()) {
      this.errorMessage = 'El nombre es requerido.';
      return false;
    }

    if (!this.user.lastName.trim()) {
      this.errorMessage = 'El apellido es requerido.';
      return false;
    }

    if (!this.user.email.trim()) {
      this.errorMessage = 'El email es requerido.';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'Formato de email inválido.';
      return false;
    }

    if (this.user.password && this.user.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    if (this.user.password && this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return false;
    }

    return true;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  volverAlInicio(): void {
  this.router.navigate(['/']);
}

}

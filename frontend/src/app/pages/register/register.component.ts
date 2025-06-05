import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../../../types/UserDTO';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Propiedades del formulario
  user: UserDTO = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: ''
  };

  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    // Si ya esta logeado pal home nomas
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  onRegister(): void {
    // limpiamooo los errores
    this.clearMessages();

    // hacemo las validaciones a ver si le pifio
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // creamos el objeto con el formato del dto
    const userToRegister: UserDTO = {
      username: this.user.email,
      email: this.user.email,
      password: this.user.password,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      address: this.user.address
    };

    // llamamos al servicio de registro le pasamo el objetito y suscribimo
    this.authService.register(userToRegister).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Cuenta creada exitosamente. Redirigiendo al login...';
        
        /**
         * @todo: agregar lo de JWT en el back
         */
        if (response.token) {
          this.authService.setToken(response.token);
        }

        // mandamo al login despues de dos segunditos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en registro:', error);
        
        if (error.status === 400) {
          this.errorMessage = error.error.message || 'Datos inválidos. Verifica la información ingresada.';
        } else if (error.status === 409) {
          this.errorMessage = 'El email ya está registrado. Intenta con otro email.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error del servidor. Intenta más tarde.';
        } else {
          this.errorMessage = 'Error inesperado. Por favor intenta nuevamente.';
        }
      }
    });
  }

  // validam0 el formulario
  private validateForm(): boolean {
    // campos requeridos
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

    if (!this.user.password) {
      this.errorMessage = 'La contraseña es requerida.';
      return false;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Debes confirmar la contraseña.';
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage = 'El formato del email no es válido.';
      return false;
    }

    // Validar longitud de contraseña
    if (this.user.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    // Validar que las contraseñas coincidan
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return false;
    }

    return true;
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  // Método para limpiar mensajes
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
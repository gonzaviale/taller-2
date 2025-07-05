import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir al home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return
    }

    google.accounts.id.initialize({
  client_id: '506891827052-sose28np6qcbn07lfsdsoav4329si5j3.apps.googleusercontent.com',
  callback: (response: any) => this.onGoogleCredentialReceived(response.credential),
});


  google.accounts.id.renderButton(
    document.getElementById('googleSignInDiv'),
    { theme: 'outline', size: 'large' }
  );
}

  onGoogleCredentialReceived(idToken: string): void {
    this.authService.loginWithGoogle(idToken).subscribe({
      next: (response) => {
        this.authService.setUserId(response.userId);
        this.authService.setToken(response.token);
        this.router.navigate(['/']);
    },
      error: (error) => {
        console.error('Login con Google falló:', error);
        this.errorMessage = 'Error al iniciar sesión con Google.';
    }
  });

  }

  onLogin(): void {
    // Limpiar mensajes de error
    this.errorMessage = '';

    // Validar que los campos no estén vacíos
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.setUserId(response.userId);
        this.authService.setToken(response.token);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en inicio de sesión:', error);

        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (error.status === 500) {
          this.errorMessage = 'Error del servidor. Intenta más tarde.';
        } else {
          this.errorMessage = 'Error inesperado. Por favor intenta nuevamente.';
        }
      }
    });
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }
}

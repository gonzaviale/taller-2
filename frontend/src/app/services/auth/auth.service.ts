import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO, UserResponseLoginDTO } from '../../../types/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = environment.api_url;

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId') && !!localStorage.getItem('token');
  }
  login(email: string, password: string): Observable<UserResponseLoginDTO> {
    return this.http.post<UserResponseLoginDTO>(`${this.apiUrl}/user/login`, { email, password });
  }
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }
  register(user: UserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }
  setUserId(id: string | undefined) {
    localStorage.setItem('userId', id || '');
  }
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}

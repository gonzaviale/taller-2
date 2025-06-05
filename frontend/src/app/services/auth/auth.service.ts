import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../../../types/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  http = inject(HttpClient);
  apiUrl = environment.api_url;

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  register(user: UserDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}

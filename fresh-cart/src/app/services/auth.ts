import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/auth';
  isLoggedIn = signal(!!localStorage.getItem('token'));
  userName = signal(localStorage.getItem('userName') || '');
  userEmail = signal(localStorage.getItem('userEmail') || '');
  userId = signal(localStorage.getItem('userId') || '');

  constructor(private http: HttpClient) {}

  register(userData: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials);
  }

  setToken(token: string, user?: { name: string; email: string; _id?: string }) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
    if (user) {
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      this.userName.set(user.name);
      this.userEmail.set(user.email);
      if (user._id) {
        localStorage.setItem('userId', user._id);
        this.userId.set(user._id);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.userEmail.set('');
    this.userId.set('');
  }
}

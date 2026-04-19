import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/cart';
  cartCount = signal(0);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return { token: localStorage.getItem('token') || '' };
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post(this.apiUrl, { productId }, { headers: this.getHeaders() });
  }

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() });
  }

  updateCount(productId: string, count: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, { count }, { headers: this.getHeaders() });
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl, { headers: this.getHeaders() });
  }
}

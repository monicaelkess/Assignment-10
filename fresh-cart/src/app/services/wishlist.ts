import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  wishlistItems = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return { token: localStorage.getItem('token') || '' };
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.apiUrl, { productId }, { headers: this.getHeaders() });
  }

  getWishlist(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() });
  }
}

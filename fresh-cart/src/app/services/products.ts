import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiBase = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiBase}/products`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiBase}/products/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiBase}/categories`);
  }

  getBrands(): Observable<any> {
    return this.http.get(`${this.apiBase}/brands`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/orders';

  constructor(private http: HttpClient) {}

  getUserOrders(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}

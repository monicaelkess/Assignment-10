import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressesService {
  private apiUrl = 'https://ecommerce.routemisr.com/api/v1/addresses';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return { token: localStorage.getItem('token') || '' };
  }

  getAddresses(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  addAddress(address: object): Observable<any> {
    return this.http.post(this.apiUrl, address, { headers: this.getHeaders() });
  }

  removeAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

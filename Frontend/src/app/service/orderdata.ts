import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Orderdata {
  private APIUrl = 'http://localhost:9090/api/v1';
  private orderUpdate = new BehaviorSubject<boolean>(false);
  orderUpdate$ = this.orderUpdate.asObservable();

  constructor(private http: HttpClient) {
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.APIUrl}/orders`)
  }

  addOrder(data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/orders`, data)
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}/orders/${id}`);
  }

  updateOrder(id: number, data: any): Observable<any> {
    return this.http.put(`${this.APIUrl}/orders/${id}`, data)
  }

  notifyUpdated(): void {
    this.orderUpdate.next(true);
  }
}

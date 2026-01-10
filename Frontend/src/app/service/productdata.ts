import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Productdata {
  private apiUrl = "http://localhost:9090/api/v1/products";
  private productUpdate = new BehaviorSubject<boolean>(false)
  productUpdate$ = this.productUpdate.asObservable();

  constructor(private http: HttpClient) {
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  notifyUpdated(): void {
    this.productUpdate.next(true);
  }
}

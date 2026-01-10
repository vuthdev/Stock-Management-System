import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Categorydata {
  private apiUrl = "http://localhost:9090/api/v1";
  private categoryUpdate = new BehaviorSubject<boolean>(false)
  categoryUpdate$ = this.categoryUpdate.asObservable();

  constructor(private http: HttpClient) {}

  getCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  updateCategory(category: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${id}`, category);
  }

  notifyUpdated(): void {
    this.categoryUpdate.next(true);
  }

  getCategoryCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/count`);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Router } from '@angular/router';

interface User {
  _id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class Userdata {
  private apiURL = 'http://localhost:9090/api/v1/users'
  private userUpdated = new Subject<void>();
  userUpdate$ = this.userUpdated.asObservable();

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSource.next(user);
  }

  loadInitialUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSource.next(user);
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  logout(): void {
    this.setCurrentUser(null);
    this.router.navigate(['/login']);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiURL}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiURL}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, user);
  }

  getUserCount(): Observable<any> {
    return this.http.get(`${this.apiURL}/count`);
  }

  uploadImageFile(id: number, form:FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/${id}/profileImage`, form)
  }

  getUserImage(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}/profileImage`);
  }

  notifyUpdated(): void {
    this.userUpdated.next();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  gender: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean; // Add remember flag
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

export interface User {
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check both localStorage and sessionStorage for token
    const token = this.getToken();
    if (token) {
      this.loadCurrentUser();
    }
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Store token based on "Remember Me" checkbox
        if (credentials.remember) {
          // Persistent storage - survives browser close
          localStorage.setItem('jwt_token', response.token);
        } else {
          // Session storage - cleared when browser closes
          sessionStorage.setItem('jwt_token', response.token);
        }

        // Set current user
        const user: User = {
          username: response.username,
          email: response.email,
          roles: response.roles,
        };
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    // Clear both storages
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // Check localStorage first, then sessionStorage
    return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  loadCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: (err) => {
        if (err.status === 401) {
          this.logout(); // explicit logout
        }
      },
    });
  }
}

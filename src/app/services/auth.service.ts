import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
  age: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = 'https://localhost:7146/api/User';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkTokenOnInit();
  }

  // Check token validity on service initialization
  private checkTokenOnInit(): void {
    const token = this.getToken();
    if (token) {
      // Simple validation - in a real app, you might want to validate the token with the server
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  isAuthenticatedValue(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    // Carregar dados do usuário se houver token
    if (this.hasToken()) {
      this.loadUserFromToken();
    }
  }

  private loadUserFromToken(): void {
    // Carregar dados do usuário do localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.next(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            this.currentUser.next(response.data.user);
            this.loggedIn.next(true);
          }
        }),
        catchError((error) => {
          console.error('Erro no login:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            this.currentUser.next(response.data.user);
            this.loggedIn.next(true);
          }
        }),
        catchError((error) => {
          console.error('Erro no registro:', error);
          return throwError(() => error);
        })
      );
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.currentUser.next(response.data.user);
          }
        }),
        catchError((error) => {
          console.error('Erro ao obter perfil:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.currentUser.next(null);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  updateProfile(profileData: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, profileData, { headers: this.getAuthHeaders() })
      .pipe(
        tap((response) => {
          if (response.success) {
            // Atualizar dados do usuário no localStorage e no estado
            const updatedUser = { ...this.currentUser.value, ...response.data.user };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            this.currentUser.next(updatedUser);
          }
        }),
        catchError((error) => {
          console.error('Erro ao atualizar perfil:', error);
          return throwError(() => error);
        })
      );
  }

  isAdmin(): boolean {
    const user = this.currentUser.value;
    return user?.isAdmin || false;
  }
}

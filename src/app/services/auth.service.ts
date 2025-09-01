import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(user: User): Observable<any> {
    // Simulação de login: verifica se o usuário existe na "API"
    // Em um projeto real, faríamos um POST para um endpoint de login
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${user.email}&password=${user.password}`)
      .pipe(
        tap((users) => {
          if (users.length > 0) {
            const token = `user-${users[0].id}`;
            localStorage.setItem('token', token);
            this.loggedIn.next(true);
          }
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}

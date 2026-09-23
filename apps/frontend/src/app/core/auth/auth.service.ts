import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  access_token: string;
}

const TOKEN_KEY = 'trackora_token';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  isLoggedIn = computed(() => this.token() !== null);

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/signin', { email, password })
      .pipe(tap((res) => this.setToken(res.access_token)));
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/signup', { email, password })
      .pipe(tap((res) => this.setToken(res.access_token)));
  }

  signOut(reason?: string): void {
    this.token.set(null);
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/signin'], {
      queryParams: reason ? { reason } : {},
    });
  }

  private setToken(token: string): void {
    this.token.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }
}

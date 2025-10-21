import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  username?: string;
  is_admin?: boolean;
  exp?: number;
  // add other claims if you include them in token
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private API_URL = 'http://localhost:8000/auth';
  private tokenKey = 'access_token';
  private platformId = inject(PLATFORM_ID);

  // login state
  private _loggedIn = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this._loggedIn.asObservable();

  // admin state
  private _isAdmin = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this._isAdmin.asObservable();

  constructor(private http: HttpClient) {
    // Initialize state from localStorage if running in browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      this._loggedIn.next(!!token);

      if (token) {
        const decoded = this.decodeToken(token);
        this._isAdmin.next(!!decoded?.is_admin);
      } else {
        this._isAdmin.next(false);
      }
    }
  }

  // Synchronous getters
  isLoggedIn(): boolean {
    return this._loggedIn.value;
  }

  isAdmin(): boolean {
    return this._isAdmin.value;
  }

  // Decode helper (safe)
  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      return null;
    }
  }

  // Login method
  login(username: string, password: string): Observable<{ access_token: string }> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http
      .post<{ access_token: string }>(`${this.API_URL}/login`, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        tap((response) => {
          // Store token if browser
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, response.access_token);
          }

          // Mark logged in
          this._loggedIn.next(true);

          // Decode token and set admin flag
          const decoded = this.decodeToken(response.access_token);
          console.log(decoded)
          const isAdmin = !!decoded?.is_admin;
          console.log(isAdmin)
          this._isAdmin.next(isAdmin);
        })
      );
  }

  // Register
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.API_URL}/signup`, payload);
  }

  // Logout — call backend then clear client state
  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.post(`${this.API_URL}/logout`, {}, { headers }).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession(),
      })
    );
  }

  // Clear client-side session
  clearSession() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this._loggedIn.next(false);
    this._isAdmin.next(false);
  }

  // Retrieve token
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // (Optional) expose decoded token for components/services
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }
}

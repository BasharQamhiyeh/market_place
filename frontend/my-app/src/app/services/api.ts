import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000'; // Change to your backend URL

@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${API_URL}/login`, user); // Implement JWT login later
  }

  getAds(token?: string): Observable<any> {
    let headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get(`${API_URL}/ads/`, { headers });
  }

  postAd(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${API_URL}/ads/`, formData, { headers });
  }
}
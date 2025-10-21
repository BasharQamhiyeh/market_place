// src/app/services/items.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private API_URL = 'http://localhost:8000/items/items'; 

  constructor(private http: HttpClient) {}

  // Fetch items with pagination
  getItems(limit: number, offset: number): Observable<any[]> {
    const url = `${this.API_URL}?limit=${limit}&skip=${offset}`;
    return this.http.get<any[]>(url);
  }

  // Add a new item with optional photos
  createItem(formData: FormData): Observable<any> {
    // Do NOT set Content-Type; Angular will handle multipart/form-data automatically
    return this.http.post(this.API_URL, formData);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.API_URL}/${id}`);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  searchItems(query: string) {
    return this.http.get<any>('http://localhost:8000/items/search', {
      params: { q: query }
    });
  }
}

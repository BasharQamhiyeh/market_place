// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attribute, AttributeOption, Category } from '../admin/models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private API_URL = 'http://localhost:8000';
  
  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories/categories`);
  }
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/categories/${id}`);
  }
  createCategory(payload: { name: string; description?: string }) {
    return this.http.post<Category>(`${this.API_URL}/categories/categories`, payload);
  }
  updateCategory(id: number, payload: { name: string; description?: string }) {
    return this.http.put<Category>(`${this.API_URL}/categories/categories/${id}`, payload);
  }
  deleteCategory(id: number) {
    return this.http.delete<void>(`${this.API_URL}/categories/categories/${id}`);
  }

  // Attributes
  getAttributes(categoryId: number): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(`${this.API_URL}/categories/categories/${categoryId}/attributes`);
  }
  createAttribute(categoryId: number, payload: Partial<Attribute>) {
    return this.http.post<Attribute>(`${this.API_URL}/categories/categories/${categoryId}/attributes`, payload);
  }
  updateAttribute(attributeId: number, payload: Partial<Attribute>) {
    return this.http.put<Attribute>(`${this.API_URL}/categories/attributes/${attributeId}`, payload);
  }
  deleteAttribute(attributeId: number) {
    return this.http.delete<void>(`${this.API_URL}/categories/attributes/${attributeId}`);
  }

  // Options
  getOptions(attributeId: number): Observable<AttributeOption[]> {
    return this.http.get<AttributeOption[]>(`${this.API_URL}/categories/attributes/${attributeId}/options`);
  }
  createOption(attributeId: number, payload: { value: string }) {
    return this.http.post<AttributeOption>(`${this.API_URL}/categories/attributes/${attributeId}/options`, payload);
  }
  updateOption(optionId: number, payload: { value: string }) {
    return this.http.put<AttributeOption>(`${this.API_URL}/categories/options/${optionId}`, payload);
  }
  deleteOption(optionId: number) {
    return this.http.delete<void>(`${this.API_URL}/categories/options/${optionId}`);
  }
}

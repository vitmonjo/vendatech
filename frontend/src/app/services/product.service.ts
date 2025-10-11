import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination?: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

export interface SingleProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProducts(category?: string, search?: string, page: number = 1, limit: number = 10): Observable<ProductResponse> {
    let params: any = { page, limit };
    if (category && category !== 'all') params.category = category;
    if (search) params.search = search;

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<SingleProductResponse> {
    return this.http.get<SingleProductResponse>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Omit<Product, '_id'>): Observable<SingleProductResponse> {
    return this.http.post<SingleProductResponse>(this.apiUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, product: Partial<Product>): Observable<SingleProductResponse> {
    return this.http.put<SingleProductResponse>(`${this.apiUrl}/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}

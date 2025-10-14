import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
}

export interface Order {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  transactionId: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData, { 
      headers: this.getAuthHeaders() 
    });
  }

  getUserOrders(page: number = 1, limit: number = 10): Observable<OrdersResponse> {
    const params = { page: page.toString(), limit: limit.toString() };
    return this.http.get<OrdersResponse>(this.apiUrl, { 
      params,
      headers: this.getAuthHeaders() 
    });
  }

  getOrderById(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`, { 
      headers: this.getAuthHeaders() 
    });
  }
}

// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from './product.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.getValue();
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }
    this.cartItemsSubject.next(currentItems);
  }

  updateQuantity(productId: number, change: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    const item = currentItems.find((i) => i.id === productId);

    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        item.quantity = newQuantity;
      } else {
        // Remove o item se a quantidade for 0 ou menos
        this.removeFromCart(productId);
      }
      this.cartItemsSubject.next(currentItems);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter((item) => item.id !== productId);
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map((items) => items.reduce((total, item) => total + item.price * item.quantity, 0))
    );
  }
}

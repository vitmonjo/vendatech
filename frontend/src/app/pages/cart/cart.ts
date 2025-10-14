// src/app/pages/cart/cart.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, BrazilianCurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  updateQuantity(productId: string, change: number): void {
    this.cartService.updateQuantity(productId, change);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToPayment(): void {
    this.router.navigate(['/payment']);
  }
}

import { ProductService } from './../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Product } from './../../services/product.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, BrazilianCurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
}

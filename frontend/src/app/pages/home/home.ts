import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    BrazilianCurrencyPipe,
    MatIconModule, // NOVO
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  private productService = inject(ProductService);
  private cartService = inject(CartService); // NOVO
  private snackBar = inject(MatSnackBar); // NOVO

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe((response) => {
      // Pega os 6 primeiros produtos da lista como "em destaque"
      this.featuredProducts = response.data.products.slice(0, 6);
    });
  }

  // NOVO: Método duplicado da página de produtos para manter a funcionalidade
  addToCart(product: Product): void {
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      this.snackBar.open(`${product.name} adicionado ao carrinho!`, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } else {
      this.snackBar.open('Produto sem estoque disponível', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
}

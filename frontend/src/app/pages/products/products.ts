import { ProductService, Product } from './../../services/product.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    BrazilianCurrencyPipe
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCategory = 'all';
  
  categories = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'eletrônicos', label: 'Eletrônicos' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'livros', label: 'Livros' },
    { value: 'casa', label: 'Casa' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'outros', label: 'Outros' }
  ];

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(
      this.selectedCategory === 'all' ? undefined : this.selectedCategory,
      this.searchTerm || undefined
    ).subscribe({
      next: (response) => {
        this.products = response.data.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.loadProducts();
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      this.snackBar.open(`${product.name} adicionado ao carrinho!`, 'Fechar', { 
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } else {
      this.snackBar.open('Produto sem estoque disponível', 'Fechar', { 
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }
}

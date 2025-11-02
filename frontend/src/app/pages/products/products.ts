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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormsModule,
    BrazilianCurrencyPipe,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  isLoading = false;
  searchTerm = '';
  selectedCategory = 'all';

  // 1. Armazena TODOS os produtos vindos da API
  private allProducts: Product[] = [];

  // 2. Armazena os produtos após o FILTRO (busca/categoria)
  public filteredProducts: Product[] = [];

  // 3. Armazena os produtos da PÁGINA ATUAL (para o HTML)
  public paginatedProducts: Product[] = [];

  // 4. Variáveis de controle do Paginator
  public totalProducts = 0; // O total de produtos *filtrados*
  public pageSize = 9; // Produtos por página
  public currentPage = 0;

  categories = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'eletrônicos', label: 'Eletrônicos' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'livros', label: 'Livros' },
    { value: 'casa', label: 'Casa' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'outros', label: 'Outros' },
  ];

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe({
      next: (response) => {
        // 1. Salva a lista mestra
        this.allProducts = response.data.products;

        // 2. Aplica filtros e paginação (client-side)
        this.applyFiltersAndPagination();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  applyFiltersAndPagination(): void {
    // 1. Aplicar Filtros (Busca e Categoria)
    let tempProducts = [...this.allProducts];
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(
        (product) => product.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filtro de Busca (Termo)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
      );
    }

    // 2. Atualizar lista filtrada e total
    this.filteredProducts = tempProducts;
    this.totalProducts = this.filteredProducts.length;
    // 3. Aplicar Paginação (Slice)
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 0; // Volta para a primeira página
    this.applyFiltersAndPagination();
  }

  onCategoryChange(): void {
    this.currentPage = 0; // Volta para a primeira página
    this.applyFiltersAndPagination();
  }
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.applyFiltersAndPagination();
  }

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

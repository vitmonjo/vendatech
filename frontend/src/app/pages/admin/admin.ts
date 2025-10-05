import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  isLoading = false;
  isEditing = false;
  editingProduct: Product | null = null;

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    image: ['', [Validators.required]],
    category: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  categories = [
    'eletrônicos',
    'roupas',
    'livros',
    'casa',
    'esportes',
    'outros'
  ];

  displayedColumns: string[] = ['name', 'price', 'category', 'stock', 'actions'];

  ngOnInit(): void {
    // Verificar se é admin
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/products']);
      return;
    }

    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
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

  onSubmit(): void {
    if (this.productForm.valid && !this.isLoading) {
      this.isLoading = true;
      const productData = this.productForm.value;

      if (this.isEditing && this.editingProduct) {
        // Atualizar produto
        const productUpdateData = {
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || 0,
          image: productData.image || '',
          category: productData.category || '',
          stock: productData.stock || 0,
        };
        this.productService.updateProduct(this.editingProduct._id!, productUpdateData).subscribe({
          next: (response) => {
            this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.snackBar.open('Erro ao atualizar produto', 'Fechar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      } else {
        // Criar novo produto
        this.productService.addProduct(productData as any).subscribe({
          next: (response) => {
            this.snackBar.open('Produto criado com sucesso!', 'Fechar', { duration: 3000 });
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Erro ao criar produto:', error);
            this.snackBar.open('Erro ao criar produto', 'Fechar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`)) {
      this.productService.deleteProduct(product._id!).subscribe({
        next: () => {
          this.snackBar.open('Produto deletado com sucesso!', 'Fechar', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Erro ao deletar produto:', error);
          this.snackBar.open('Erro ao deletar produto', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.editingProduct = null;
    this.isLoading = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}

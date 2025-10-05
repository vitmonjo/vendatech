import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './my-products.html',
  styleUrl: './my-products.css',
})
export class MyProducts implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'price', 'actions'];
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((response) => {
      this.products = response.data.products;
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja excluir esse produto?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.getProducts(); // Atualiza lista após exclusão
      });
    }
  }
}

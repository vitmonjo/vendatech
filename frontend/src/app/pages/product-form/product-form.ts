import { Product } from './../../services/product.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIconModule,MatCardModule, MatSelectModule, MatOptionModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  isEditMode = false;
  productId: string | null = null;

  productForm = this.fb.group({
    _id: [''],
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    category: [''],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe((response) => {
      this.productForm.patchValue(response.data.product);
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product = this.productForm.value as Partial<Product>;

      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe(() => {
          this.router.navigate(['/my-products']);
        });
      } else {
        // Remove o _id para a criação de novo produto
        const {_id, ...newProduct} = product;
        this.productService.addProduct(newProduct as Omit<Product, '_id'>).subscribe(() => {
          this.router.navigate(['/my-products']);
        });
      }
    }
  }
}

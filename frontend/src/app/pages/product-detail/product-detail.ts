import { ProductService } from './../../services/product.service';
import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message, MessageService } from '../../services/message.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DecimalPipe,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product: Product | undefined;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);

  messageForm = this.fb.group({
    content: ['', Validators.required],
  });

  buyNow(): void {
    if (this.product) {
      // Adicionar ao carrinho e redirecionar
      this.cartService.addToCart(this.product);
      alert(`${this.product.name} adicionado ao carrinho!`);
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe((response) => {
      this.product = response.data.product;
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.product) {
      const message: Omit<Message, 'id'> = {
        productId: this.product._id!,
        senderId: 1, // Simula um usuário logado com id 1
        content: this.messageForm.value.content || '',
        timestamp: new Date(),
      };

      this.messageService.sendMessage(message).subscribe(() => {
        alert('Mensagem enviada com sucesso!');
        this.messageForm.reset();
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      alert(`${this.product.name} adicionado ao carrinho!`);
    }
  }
}

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentDialog } from '../../core/payment-dialog/payment-dialog';
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
    MatDialogModule,
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
  private dialog = inject(MatDialog);
  private cartService = inject(CartService);

  messageForm = this.fb.group({
    content: ['', Validators.required],
  });

  buyNow(): void {
    if (this.product) {
      const dialogRef = this.dialog.open(PaymentDialog, {
        width: '400px',
        data: {
          productName: this.product.name,
          productPrice: this.product.price,
          productId: this.product.id,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'success') {
          alert('Pagamento concluído!');
          // Futuramente adicionar a lógica real de compra, adicionar ao carrinho, integrar coim gateway de pagamento ou redirecionar para o checkout
        } else if (result === 'error') {
          alert('O pagamento falhou.');
        }
      });
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe((product) => {
      this.product = product;
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.product) {
      const message: Omit<Message, 'id'> = {
        productId: this.product.id!,
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

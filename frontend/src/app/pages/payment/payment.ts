import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PaymentService, PaymentRequest, PaymentCard } from '../../services/payment.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  cartTotal = 0;
  cartItems: any[] = [];

  paymentForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerCpf: ['', [Validators.required]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
    expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    cardHolderName: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      
      if (this.cartItems.length === 0) {
        this.snackBar.open('Carrinho vazio! Adicione produtos antes de finalizar a compra.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/cart']);
      }
    });

    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.patchValue({ cardNumber: formattedValue });
  }

  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    let formattedValue = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    this.paymentForm.patchValue({ customerCpf: formattedValue });
  }

  onSubmit(): void {
    if (this.paymentForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.paymentForm.value;
      
      // Preparar dados do cartão
      const card: PaymentCard = {
        number: formValue.cardNumber!.replace(/\s/g, ''),
        expiryMonth: formValue.expiryMonth!,
        expiryYear: formValue.expiryYear!,
        cvv: formValue.cvv!,
        holderName: formValue.cardHolderName!
      };

      // Preparar dados do pagamento
      const paymentData: PaymentRequest = {
        customerName: formValue.customerName!,
        customerCpf: formValue.customerCpf!.replace(/\D/g, ''),
        card: card,
        amount: this.cartTotal,
        description: `Compra de ${this.cartItems.length} produto(s) - VendaTech`
      };

      // Validar dados antes do envio
      if (!this.paymentService.validateCard(card)) {
        this.snackBar.open('Dados do cartão inválidos. Verifique as informações.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
        return;
      }

      if (!this.paymentService.validateCpf(paymentData.customerCpf)) {
        this.snackBar.open('CPF inválido. Verifique o número informado.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
        return;
      }

      // Processar pagamento
      this.paymentService.processPayment(paymentData).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success) {
            this.snackBar.open('Pagamento realizado com sucesso!', 'Fechar', { duration: 5000 });
            
            // Limpar carrinho
            this.cartService.clearCart();
            
            // Redirecionar para página de sucesso
            this.router.navigate(['/payment-success'], { 
              queryParams: { 
                transactionId: response.transactionId,
                amount: this.cartTotal 
              } 
            });
          } else {
            this.snackBar.open(`Pagamento falhou: ${response.message}`, 'Fechar', { duration: 5000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro no pagamento:', error);
          this.snackBar.open(
            error.error?.message || 'Erro ao processar pagamento. Tente novamente.',
            'Fechar',
            { duration: 5000 }
          );
        }
      });
    } else {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}

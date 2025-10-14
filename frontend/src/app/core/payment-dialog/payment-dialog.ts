// src/app/core/payment-dialog/payment-dialog.ts
import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../../services/payment.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';

export interface PaymentDialogData {
  productName: string;
  productPrice: number;
  productId: number;
}

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BrazilianCurrencyPipe],
  templateUrl: './payment-dialog.html',
  styleUrl: './payment-dialog.css',
})
export class PaymentDialog implements OnInit {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  public dialogRef = inject(MatDialogRef<PaymentDialog>);
  public data: PaymentDialogData = inject(MAT_DIALOG_DATA);

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
    expiry: ['', [Validators.required, Validators.pattern('(0[1-9]|1[0-2])\\/[0-9]{2}')]],
    cvv: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        ...this.paymentForm.value,
        amount: this.data.productPrice,
        productId: this.data.productId,
      };

      this.paymentService.processPayment(paymentData as any).subscribe(
        (response) => {
          alert('Pagamento processado com sucesso!');
          this.dialogRef.close('success');
        },
        (error) => {
          alert(error.message || 'Falha no pagamento. Tente novamente.');
          this.dialogRef.close('error');
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close('cancel');
  }
}

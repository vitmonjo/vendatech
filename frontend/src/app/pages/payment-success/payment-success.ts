import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  transactionId: string = '';
  amount: number = 0;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transactionId = params['transactionId'] || '';
      this.amount = parseFloat(params['amount']) || 0;
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}

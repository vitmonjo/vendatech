import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarRef, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertService, PriceAlert } from '../../services/alert.service';
import { BrazilianCurrencyPipe } from '../../pipes/brazilian-currency.pipe';

@Component({
  selector: 'app-price-alert',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, BrazilianCurrencyPipe],
  template: `
    <div class="price-alert-container">
      <div class="alert-content">
        <div class="alert-icon">
          <mat-icon>local_offer</mat-icon>
        </div>
        <div class="alert-text">
          <h4>🎉 Oferta Especial!</h4>
          <p><strong>{{ alert.productName }}</strong></p>
          <p class="price">Apenas {{ alert.price | brazilianCurrency }}</p>
        </div>
      </div>
      <div class="alert-actions">
        <button mat-button color="primary" (click)="viewProduct()">
          <mat-icon>visibility</mat-icon>
          Ver Produto
        </button>
        <button mat-icon-button (click)="dismiss()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .price-alert-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
    }

    .alert-content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .alert-icon {
      margin-right: 12px;
      font-size: 24px;
    }

    .alert-text h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .alert-text p {
      margin: 0;
      font-size: 14px;
    }

    .price {
      font-weight: 700;
      color: #ffeb3b;
    }

    .alert-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .alert-actions button {
      color: white;
    }

    .alert-actions button[color="primary"] {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .alert-actions button[color="primary"]:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class PriceAlertComponent implements OnInit {
  alert!: PriceAlert;
  private router = inject(Router);
  private snackBarRef = inject(MatSnackBarRef);

  ngOnInit(): void {
    // O alert será passado via data do MatSnackBar
    this.alert = this.snackBarRef.containerInstance.snackBarConfig.data;
  }

  viewProduct(): void {
    this.router.navigate(['/products', this.alert.productId]);
    this.dismiss();
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}

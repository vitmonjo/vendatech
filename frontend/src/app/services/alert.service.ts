import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Product, ProductService } from './product.service';

export interface PriceAlert {
  productId: number;
  productName: string;
  price: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private productService = inject(ProductService);
  private priceAlert = new Subject<{ productId: string; productName: string; price: number }>();
  priceAlert$ = this.priceAlert.asObservable();
  private checkInterval: any;
  private alertedProducts = new Set<number>(); // Controla produtos já alertados
  private lastCheckTime = new Date();

  constructor() {
    this.startPriceCheck();
  }

  startPriceCheck(): void {
    this.checkInterval = setInterval(() => {
      this.checkPrices();
    }, 30000); // Checa a cada 30 segundos (reduzido para evitar spam)
  }

  checkPrices(): void {
    this.productService.getProducts().subscribe((response) => {
      // Lógica de verificação de preço
      // Neste exemplo, vamos checar se algum produto custa menos de R$ 2000
      response.data.products.forEach((product) => {
        if (product.price < 2000) {
          this.priceAlert.next({
            productId: product._id!,
            productName: product.name,
            price: product.price,
            timestamp: currentTime,
          });
          
          // Marca como alertado
          this.alertedProducts.add(productId);
        }
      });
      
      this.lastCheckTime = currentTime;
    });
  }

  // Método para limpar histórico de alertas (útil para reset)
  clearAlertHistory(): void {
    this.alertedProducts.clear();
  }

  // Método para resetar alerta de um produto específico
  resetProductAlert(productId: number): void {
    this.alertedProducts.delete(productId);
  }

  stopPriceCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

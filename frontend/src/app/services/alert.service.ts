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
  private priceAlert = new Subject<PriceAlert>();
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
    this.productService.getProducts().subscribe((products) => {
      const currentTime = new Date();
      
      // Filtra produtos com preço menor que R$ 2000
      const affordableProducts = products.filter(product => product.price < 2000);
      
      // Só alerta produtos que ainda não foram alertados recentemente
      affordableProducts.forEach((product) => {
        const productId = product.id!;
        const timeSinceLastAlert = currentTime.getTime() - this.lastCheckTime.getTime();
        
        // Só alerta se não foi alertado recentemente (últimos 5 minutos)
        if (!this.alertedProducts.has(productId) || timeSinceLastAlert > 300000) {
          this.priceAlert.next({
            productId: productId,
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

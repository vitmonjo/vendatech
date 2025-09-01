import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Product, ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private productService = inject(ProductService);
  private priceAlert = new Subject<{ productId: number; productName: string; price: number }>();
  priceAlert$ = this.priceAlert.asObservable();
  private checkInterval: any;

  constructor() {
    this.startPriceCheck();
  }

  startPriceCheck(): void {
    this.checkInterval = setInterval(() => {
      this.checkPrices();
    }, 10000); // Checa a cada 10 segundos
  }

  checkPrices(): void {
    this.productService.getProducts().subscribe((products) => {
      // Lógica de verificação de preço
      // Neste exemplo, vamos checar se algum produto custa menos de R$ 2000
      products.forEach((product) => {
        if (product.price < 2000) {
          this.priceAlert.next({
            productId: product.id!,
            productName: product.name,
            price: product.price,
          });
        }
      });
    });
  }

  stopPriceCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

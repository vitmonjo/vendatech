import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { fader } from './animations'; // Vamos criar este arquivo
import { AlertService } from './services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [fader],
})
export class App implements OnInit {
  title = 'sales-app';
  private alertService = inject(AlertService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.alertService.priceAlert$.subscribe((alert) => {
      this.showPriceAlert(alert.productName, alert.price);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  showPriceAlert(productName: string, price: number): void {
    this.snackBar.open(
      `Alerta de preço! ${productName} agora custa R$ ${price.toFixed(2)}.`,
      'Fechar',
      { duration: 5000 }
    );
  }
}

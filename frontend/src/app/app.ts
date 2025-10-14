import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { fader } from './animations'; // Vamos criar este arquivo
import { AlertService, PriceAlert } from './services/alert.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

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
  private router = inject(Router);

  ngOnInit(): void {
    this.alertService.priceAlert$.subscribe((alert) => {
      this.showPriceAlert(alert);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  showPriceAlert(alert: PriceAlert): void {
    const snackBarRef = this.snackBar.open(
      `Alerta de preço! ${alert.productName} agora custa R$ ${alert.price.toFixed(2)}.`,
      'Ver Produto',
      { 
        duration: 8000, // Aumentado para 8 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['price-alert-snackbar']
      }
    );

    // Ação quando clica em "Ver Produto"
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/products', alert.productId]);
    });
  }
}

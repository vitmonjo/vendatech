import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { fader } from './animations'; // Vamos criar este arquivo
import { AlertService, PriceAlert } from './services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceAlertComponent } from './core/price-alert/price-alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [fader],
})
export class App implements OnInit {
  title = 'vendatech';
  private alertService = inject(AlertService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.alertService.priceAlert$.subscribe((alert) => {
      this.showPriceAlert(alert);
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  showPriceAlert(alert: PriceAlert): void {
    this.snackBar.openFromComponent(PriceAlertComponent, {
      data: alert,
      duration: 8000, // 8 segundos para dar tempo de clicar
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['price-alert-snackbar'],
    });
  }

  public currentYear: number = new Date().getFullYear();
}

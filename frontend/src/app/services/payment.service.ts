import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface PaymentRequest {
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
  productId: number;
}

export interface Card {
  cardNumber: string;
  expiry: string;
  cvv: string;
  limit: number;
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private cardApiUrl = 'http://localhost:3000/cards';
  private paymentApiUrl = 'http://localhost:3000/payments';

  processPayment(request: PaymentRequest): Observable<any> {
    return this.http.get<Card[]>(`${this.cardApiUrl}?cardNumber=${request.cardNumber}`).pipe(
      map((cards) => {
        const card = cards[0];
        if (!card) {
          throw new Error('Cartão não encontrado.');
        }
        if (card.limit - card.balance < request.amount) {
          throw new Error('Limite de cartão insuficiente.');
        }
        return { card, request };
      }),
      tap(({ card, request }) => {
        // Simula a aprovação e atualiza o saldo do cartão
        const newBalance = card.balance + request.amount;
        this.http
          .patch(`${this.cardApiUrl}/${card.cardNumber}`, { balance: newBalance })
          .subscribe();

        // Registra a transação
        const paymentRecord = {
          productId: request.productId,
          userId: 1, // Simular o ID do usuário logado
          amount: request.amount,
          status: 'approved',
          timestamp: new Date().toISOString(),
        };
        this.http.post(this.paymentApiUrl, paymentRecord).subscribe();
      }),
      catchError((error) => {
        return throwError(() => new Error(error.message || 'Erro ao processar pagamento.'));
      })
    );
  }
}

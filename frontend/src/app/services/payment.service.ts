import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentCard {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}

export interface PaymentRequest {
  customerName: string;
  customerCpf: string;
  customerEmail?: string; // Opcional - backend gera se não fornecido
  card: PaymentCard;
  amount: number;
  description?: string;
  orderId?: string; // Opcional - backend gera se não fornecido
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  
  // URL mock - será substituída pela URL real do sistema de pagamento
  private paymentApiUrl = `${environment.apiUrl}/payment`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Processa um pagamento
   * @param paymentData Dados do pagamento (nome, CPF, cartão, valor)
   * @returns Observable com resultado do pagamento
   */
  processPayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.paymentApiUrl}/process`,
      paymentData,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Valida os dados do cartão antes do envio
   * Aceita qualquer número de cartão - validação será feita pelo gateway de pagamento
   * @param card Dados do cartão
   * @returns true se válido, false caso contrário
   */
  validateCard(card: PaymentCard): boolean {
    // Aceita qualquer número de cartão (validação será feita pelo TrustPay)
    const cardNumber = card.number.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 1) {
      return false;
    }

    // Validação básica do CVV (aceita qualquer número)
    if (!card.cvv || card.cvv.trim().length < 1) {
      return false;
    }

    // Validação básica do mês de expiração
    const month = parseInt(card.expiryMonth);
    if (!month || month < 1 || month > 12) {
      return false;
    }

    // Validação básica do ano de expiração
    const year = parseInt(card.expiryYear);
    if (!year || year < 1000) {
      return false;
    }

    // Validação básica do nome do portador
    if (!card.holderName || card.holderName.trim().length < 2) {
      return false;
    }

    return true;
  }

  /**
   * Valida CPF (algoritmo básico)
   * @param cpf CPF a ser validado
   * @returns true se válido, false caso contrário
   */
  validateCpf(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
      return false;
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return false;
    }

    // Algoritmo de validação do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  }
}
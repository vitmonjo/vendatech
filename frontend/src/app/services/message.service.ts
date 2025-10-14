import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timestamp } from 'rxjs';

export interface Message {
  id?: number;
  productId: string;
  senderId: number;
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/messages';

  sendMessage(message: Omit<Message, 'id'>): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, { ...message, timestamp: new Date() });
  }

  getMessagesByProductId(productId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}?productId=${productId}`);
  }
}

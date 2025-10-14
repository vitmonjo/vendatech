import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brazilianCurrency',
  standalone: true
})
export class BrazilianCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

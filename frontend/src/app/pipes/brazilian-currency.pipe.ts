import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brazilianCurrency',
  standalone: true
})
export class BrazilianCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || value === undefined) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

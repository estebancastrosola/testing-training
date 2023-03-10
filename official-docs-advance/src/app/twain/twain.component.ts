import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';

import { TwainService } from './twain.service';

@Component({
  selector: 'twain-quote',
  template: `
    <p class="twain"><i>{{quote | async}}</i></p>
    <button type="button" (click)="getQuote()">Next quote</button>
    <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>`,
  styles: [
    '.twain { font-style: italic; } .error { color: red; }'
  ]

})
export class TwainComponent implements OnInit {
  errorMessage!: string;
  quote!: Observable<string>;

  constructor(private twainService: TwainService) {}

  ngOnInit(): void {
    this.getQuote();
  }

  getQuote() { //como podriamos probar esta funcion asincrona? Pues con Spy. Generalmente, en los test no se hacen llamadas a servidores remotos. Se suelen simulan las llamadas
    this.errorMessage = '';
    this.quote = this.twainService.getQuote().pipe(
      startWith('...'), //Valor inicial! pone ... como valor antes del primer valor del observable
      catchError( (err: any) => {
        // Wait a turn because errorMessage already set once this turn
        setTimeout(() => this.errorMessage = err.message || err.toString());
        return of('...'); // reset message to placeholder
      })
    );
  }

}

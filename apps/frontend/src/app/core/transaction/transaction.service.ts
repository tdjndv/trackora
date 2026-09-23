import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import {
  FilterTransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto,
  Transaction,
} from '../../type/transaction.type';
import { tap } from 'rxjs';

@Service()
export class TransactionService {
  private http = inject(HttpClient);

  readonly transactions = signal<Transaction[]>([]);

  loadForAccount(accountId: string, filters: FilterTransactionDto = {}) {
    let params = new HttpParams().set('accountId', accountId);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    return this.http
      .get<Transaction[]>('/api/transactions', {
        params,
      })
      .pipe(tap((list) => this.transactions.set(list)));
  }

  create(payload: CreateTransactionDto) {
    return this.http.post<Transaction>('/api/transactions', payload);
  }

  update(id: string, payload: UpdateTransactionDto) {
    return this.http
      .patch<Transaction>(`/api/transactions/${id}`, payload)
      .pipe(
        tap((updated) =>
          this.transactions.update((list) =>
            list.map((tx) => (tx.id === id ? updated : tx)),
          ),
        ),
      );
  }

  remove(id: string) {
    return this.http
      .delete<void>(`/api/transactions/${id}`)
      .pipe(
        tap(() =>
          this.transactions.update((list) => list.filter((tx) => tx.id !== id)),
        ),
      );
  }
}

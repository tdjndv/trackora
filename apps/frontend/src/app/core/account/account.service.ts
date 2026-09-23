import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Account, CreateAccountDto } from '../../type/account.type';
import { tap } from 'rxjs';

@Service()
export class AccountService {
  private http = inject(HttpClient);

  accounts = signal<Account[]>([]);
  selectedId = signal<string | null>(null);

  readonly selected = computed(
    () => this.accounts().find((a) => a.id === this.selectedId()) ?? null,
  );

  load() {
    return this.http.get<Account[]>('/api/accounts').pipe(
      tap((accounts) => {
        this.accounts.set(accounts);
        if (!this.selectedId() && accounts.length > 0) {
          this.selectedId.set(accounts[0].id);
        }
      }),
    );
  }

  create(payload: CreateAccountDto) {
    return this.http.post<Account>('/api/accounts', payload).pipe(
      tap((account) => {
        this.accounts.update((list) => [...list, account]);
        this.selectedId.set(account.id);
      }),
    );
  }

  select(id: string): void {
    this.selectedId.set(id);
  }
}

// apps/frontend/src/app/features/accounts/accounts.component.ts
import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/account/account.service';
import { CreateAccountComponent } from './create-account/create-account.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CreateAccountComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  private accountService = inject(AccountService);

  readonly accounts = this.accountService.accounts;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.accountService.load().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load accounts');
      },
    });
  }
}

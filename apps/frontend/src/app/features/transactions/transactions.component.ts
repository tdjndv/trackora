// features/transactions/transactions.component.ts
import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TransactionCategory,
  TransactionType,
  FilterTransactionDto,
} from '../../type/transaction.type';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AccountService } from '../../core/account/account.service';
import { TransactionService } from '../../core/transaction/transaction.service';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { TransactionRowComponent } from './transaction-row/transaction-row.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CreateTransactionComponent,
    TransactionRowComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly selectedAccount = this.accountService.selected;
  readonly transactions = this.transactionService.transactions;

  readonly types = Object.values(TransactionType);
  readonly categories = Object.values(TransactionCategory);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filters = toSignal(
    this.route.queryParamMap.pipe(
      map(
        (p): FilterTransactionDto => ({
          type: (p.get('type') as TransactionType) ?? undefined,
          category: (p.get('category') as TransactionCategory) ?? undefined,
          search: p.get('search') ?? undefined,
        }),
      ),
    ),
    { initialValue: {} as FilterTransactionDto },
  );

  readonly form = this.fb.nonNullable.group({
    search: [this.route.snapshot.queryParamMap.get('search') ?? ''],
    type: [this.route.snapshot.queryParamMap.get('type') ?? ''],
    category: [this.route.snapshot.queryParamMap.get('category') ?? ''],
  });

  constructor() {
    this.accountService.load().subscribe({ error: () => undefined });

    this.form.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.updateUrl());

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUrl());

    this.form.controls.category.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUrl());

    effect(() => {
      const account = this.selectedAccount();
      const filters = this.filters();
      if (!account) return;

      this.loading.set(true);
      this.error.set(null);

      this.transactionService.loadForAccount(account.id, filters).subscribe({
        next: () => this.loading.set(false),
        error: () => {
          this.loading.set(false);
          this.error.set('Could not load transactions');
        },
      });
    });
  }

  clearFilters(): void {
    this.form.reset({ search: '', type: '', category: '' });
  }

  onCreated(): void {
    this.clearFilters();

    const account = this.selectedAccount();
    if (account) {
      this.transactionService
        .loadForAccount(account.id, this.filters())
        .subscribe();
    }
  }

  private updateUrl(): void {
    const { search, type, category } = this.form.getRawValue();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: search || null,
        type: type || null,
        category: category || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}

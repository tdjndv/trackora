// apps/frontend/src/app/features/transactions/create-transaction/create-transaction.component.ts
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TransactionCategory,
  TransactionType,
} from '../../../type/transaction.type';
import { TransactionService } from '../../../core/transaction/transaction.service';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  readonly created = output<void>();

  readonly accountId = input.required<string>();

  readonly types = Object.values(TransactionType);
  readonly categories = Object.values(TransactionCategory);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    description: ['', [Validators.maxLength(500)]],
    amount: [
      '',
      [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
    ],
    type: [TransactionType.Expense, [Validators.required]],
    category: [TransactionCategory.Other, [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { description, amount, type, category } = this.form.getRawValue();

    this.transactionService
      .create({
        description: description.trim() || undefined,
        amountCents: Math.round(parseFloat(amount) * 100),
        type,
        category,
        accountId: this.accountId(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.form.reset({
            description: '',
            amount: '',
            type: TransactionType.Expense,
            category: TransactionCategory.Other,
          });
          this.created.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(
            err.status === 404
              ? 'That account no longer exists'
              : 'Could not create the transaction',
          );
        },
      });
  }
}

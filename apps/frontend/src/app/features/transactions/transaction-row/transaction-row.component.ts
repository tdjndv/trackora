// apps/frontend/src/app/features/transactions/transaction-row/transaction-row.component.ts
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../../../type/transaction.type';
import { TransactionService } from '../../../core/transaction/transaction.service';

@Component({
  selector: 'app-transaction-row',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-row.component.html',
  styleUrl: './transaction-row.component.css',
})
export class TransactionRowComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  readonly transaction = input.required<Transaction>();
  readonly currency = input.required<string>();

  readonly types = Object.values(TransactionType);
  readonly categories = Object.values(TransactionCategory);

  readonly editing = signal(false);
  readonly confirmingDelete = signal(false);
  readonly saving = signal(false);
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

  readonly formattedAmount = computed(() =>
    new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: this.currency(),
    }).format(this.transaction().amountCents / 100),
  );

  startEdit(): void {
    const tx = this.transaction();
    this.form.setValue({
      description: tx.description ?? '',
      amount: (tx.amountCents / 100).toFixed(2),
      type: tx.type,
      category: tx.category,
    });
    this.error.set(null);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.error.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const { description, amount, type, category } = this.form.getRawValue();

    this.transactionService
      .update(this.transaction().id, {
        description: description.trim() || undefined,
        amountCents: Math.round(parseFloat(amount) * 100),
        type,
        category,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.editing.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(
            err.status === 404
              ? 'This transaction no longer exists'
              : 'Could not save',
          );
        },
      });
  }

  remove(): void {
    this.saving.set(true);

    this.transactionService.remove(this.transaction().id).subscribe({
      next: () => {
        // the row disappears when the parent's signal updates
      },
      error: () => {
        this.saving.set(false);
        this.confirmingDelete.set(false);
        this.error.set('Could not delete');
      },
    });
  }
}

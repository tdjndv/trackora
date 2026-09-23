import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/account/account.service';
import { AccountType } from '../../../type/account.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);

  accountTypes = Object.values(AccountType);
  currencies = ['CAD', 'USD', 'EUR', 'CNY', 'GBP'];

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: [AccountType.Checkings, [Validators.required]],
    currency: ['CAD', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.accountService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.reset({ type: AccountType.Checkings, currency: 'CAD' });
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409
            ? 'You already have an account with that name'
            : 'Could not create the account',
        );
      },
    });
  }
}

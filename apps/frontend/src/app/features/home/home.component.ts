import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AccountService } from '../../core/account/account.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private auth = inject(AuthService);
  private accountService = inject(AccountService);

  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly accounts = this.accountService.accounts;

  constructor() {
    if (this.isLoggedIn()) {
      this.accountService.load().subscribe({ error: () => undefined });
    }
  }
}

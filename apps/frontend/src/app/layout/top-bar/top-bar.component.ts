import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountType } from '../../type/account.type';
import { AccountService } from '../../core/account/account.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  private accountService = inject(AccountService);
  private auth = inject(AuthService);
  private host = inject(ElementRef<HTMLElement>);

  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly accounts = this.accountService.accounts;
  readonly selected = this.accountService.selected;

  readonly open = signal(false);

  readonly typeLabels: Record<AccountType, string> = {
    [AccountType.Cash]: 'Cash',
    [AccountType.CreditCard]: 'Credit card',
    [AccountType.Checkings]: 'Chequing',
    [AccountType.Savings]: 'Savings',
  };

  toggle(): void {
    this.open.update((v) => !v);
  }

  choose(id: string): void {
    this.accountService.select(id);
    this.open.set(false);
  }

  signOut(): void {
    this.open.set(false);
    this.auth.signOut();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }
}

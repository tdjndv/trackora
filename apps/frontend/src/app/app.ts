import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar/top-bar.component';

@Component({
  imports: [RouterOutlet, TopBarComponent],
  selector: 'app-root',
  template: `
    <app-top-bar />
    <router-outlet />
  `,
})
export class App {}

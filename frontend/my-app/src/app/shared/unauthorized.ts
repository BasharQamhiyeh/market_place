// src/app/auth/unauthorized.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="p-4 text-center">
      <h2>403 - Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  `
})
export class UnauthorizedComponent {}
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { first, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAdmin$.pipe(
      first(), // take the current value
      tap((isAdmin) => {
        if (!isAdmin) {
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}

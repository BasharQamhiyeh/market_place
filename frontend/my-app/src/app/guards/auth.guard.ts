import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { first, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.loggedIn$.pipe(
      first(), // take the current value
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['']);
        }
      })
    );
  }
}

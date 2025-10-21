import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth); // Inject the Auth service
  const token = auth.getToken(); // Get the token from the Auth service

  // Clone the request and add the Authorization header if the token exists
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned); // Pass the cloned (or original) request to the next handler
};
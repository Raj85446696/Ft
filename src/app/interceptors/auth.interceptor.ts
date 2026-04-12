import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { IdentityService } from '../services/identity.service';

/**
 * HTTP Interceptor to add token to requests and handle auth errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);
  
  // Get token from service
  const token = identityService.getToken();
  
  // Clone request and add token to body if it exists
  // Note: Identity Service expects token in request body, not headers
  let modifiedReq = req;
  
  if (token && req.method !== 'GET') {
    // For POST/PUT/DELETE requests, add token to body
    const body = req.body || {};
    modifiedReq = req.clone({
      body: { ...body, token: token }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle authentication errors
      if (error.status === 401 || error.error?.rc === 'LFT' || error.error?.rc === 'UAU') {
        // Token expired or unauthorized - clear storage (only in browser)
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};

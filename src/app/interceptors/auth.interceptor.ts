import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { IdentityService } from '../services/identity.service';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor to handle two API styles:
 * 1. Legacy endpoints (identity-service, core legacy): token in request body
 * 2. Modern REST endpoints (core REST): Bearer token in Authorization header
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  const token = identityService.getToken();
  let modifiedReq = req;

  if (token) {
    const isRestEndpoint = isModernRestRequest(req.url);

    if (isRestEndpoint) {
      // Modern REST: Add Bearer token in Authorization header
      // Skip if header already set (e.g. by CoreService)
      if (!req.headers.has('Authorization')) {
        modifiedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    } else if (req.method !== 'GET') {
      // Legacy: Add token to request body (for POST requests)
      const body = req.body || {};
      if (typeof body === 'object' && !Array.isArray(body)) {
        modifiedReq = req.clone({
          body: { ...body, token: token }
        });
      }
    }
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.error?.rc === 'LFT' || error.error?.rc === 'UAU') {
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

/**
 * Determine if a URL targets a modern REST endpoint (needs Bearer header)
 * REST endpoints have paths like /api/core/department-visibility, /api/core/ratings, etc.
 * Legacy endpoints are: /slfXxx, /actdeact, /ddc, /fetchDeptVisibility, /api/identity/ws1/xxx
 */
function isModernRestRequest(url: string): boolean {
  const coreRestPaths = [
    '/department-visibility',
    '/departments/',
    '/department-report-card',
    '/service-groups',
    '/service-keywords',
    '/ratings',
    '/notifications',
    '/payment-gateway',
    '/aicte',
    '/soap-testing',
    '/ws1/slffetchGroupTypes',
    '/ws1/slfaddOrUpdateGroupType',
    '/ws1/slfdeleteGroupType',
  ];

  // If the URL contains /api/core/ followed by a REST path, it's modern
  if (url.includes('/api/core/')) {
    return coreRestPaths.some(p => url.includes(p));
  }

  return false;
}

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { IdentityService } from '../services/identity.service';
import { map, catchError, of } from 'rxjs';

/**
 * Auth Guard to protect routes
 * Validates session before allowing access to protected routes
 */
export const authGuard: CanActivateFn = (route, state) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  // Check if user has token
  if (!identityService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Validate session with Identity Service
  return identityService.validateSession().pipe(
    map(isValid => {
      if (isValid) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

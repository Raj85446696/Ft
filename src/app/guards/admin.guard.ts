import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { IdentityService } from '../services/identity.service';

/**
 * Admin Guard to protect admin-only routes
 * Checks if user is authenticated AND has admin role
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  if (!identityService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!identityService.isAdmin()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

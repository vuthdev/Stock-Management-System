import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth';
import { map, take } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }

        // Token exists but user not loaded yet
        authService.loadCurrentUser();
        return true;
      })
    );
  }

  // Redirect to login if not authenticated
  router.navigate(['/login']);
  return false;
};

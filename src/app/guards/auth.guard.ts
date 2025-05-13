import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        // If this is an auth route (login/register), redirect to Home if already authenticated
        if (route.data['authRoute']) {
          return isAuthenticated
            ? this.router.createUrlTree(['/Home'])
            : true;
        }

        // For protected routes (requires authentication)
        if (!isAuthenticated) {
          return this.router.createUrlTree(['/login']);
        }

        // If authenticated and trying to access a protected route
        return true;
      })
    );
  }
}

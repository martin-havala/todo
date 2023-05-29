import { Injectable, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';
import { TodoMenuComponent } from './modules/core/components/todo-menu/todo-menu.component';

@Injectable({ providedIn: 'root' })
export class CanActivateRouteGuard implements CanActivateRouteGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      map((is) => {
        if (!is) {
          this.router.navigate(['']);
        }
        return is;
      })
    );
  }
}

const routes: Routes = [
  {
    path: 'detail',
    loadChildren: () =>
      import('./modules/detail/detail.module').then((m) => m.DetailModule),
    canActivate: [CanActivateRouteGuard],
  },
  { path: '**', component: TodoMenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
})
export class AppRoutingModule {}

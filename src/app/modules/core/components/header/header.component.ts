import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  public authenticated$!: Observable<boolean>;
  public userInfo$!: Observable<User | null | undefined>;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authenticated$ = this.authService.isAuthenticated$;
    this.userInfo$ = this.authService.user$;
  }

  login() {
    this.authService.loginWithRedirect();
  }

  logout() {
    this.authService.logout({
      logoutParams: {
        returnTo: document.location.origin + (isDevMode() ? '' : '/todo'),
      },
    });
  }
}

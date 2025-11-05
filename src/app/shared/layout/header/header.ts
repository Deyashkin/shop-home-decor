import {Component, inject, Input} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {CartService} from '../../services/cart.service';
import {MatMenuModule} from '@angular/material/menu';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import type {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import type {DefaultResponseType} from '../../../../types/default-response.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private _snackBar = inject(MatSnackBar);

  count: number = 0;
  isLogged: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private cartService: CartService,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe(data => {
        this.count = data.count;
      });

    this.cartService.count$.subscribe(count => {
      this.count = count;
    })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: (errorRespose: HttpErrorResponse) => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}

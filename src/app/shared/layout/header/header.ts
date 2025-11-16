import {Component, HostListener, inject, Input} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {CartService} from '../../services/cart.service';
import {MatMenuModule} from '@angular/material/menu';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import type {
  CategoryWithTypeType
} from '../../../../types/category-with-type.type';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import type {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {debounceTime} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatMenuModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private _snackBar = inject(MatSnackBar);

  searchField = new FormControl();
  showedSearch: boolean = false;
  products: ProductType[] = [];
  searchValue: string = '';
  count: number = 0;
  isLogged: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private authService: AuthService,
              private router: Router,
              private cartService: CartService,
              private productService: ProductService,
              ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
            })
        } else {
          this.products = [];
          this.showedSearch = true;
        }
      })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data) => {


        this.count = (data as { count: number }).count;
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

  // changeSearchValue(newValue: string) {
  //   this.searchValue = newValue;
  //
  //   if (this.searchValue && this.searchValue.length > 2) {
  //     this.productService.searchProducts(this.searchValue)
  //       .subscribe((data: ProductType[]) => {
  //         this.products = data;
  //       })
  //   } else {
  //     this.products = [];
  //     this.showedSearch = true;
  //   }
  // }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
    this.showedSearch = false;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLInputElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

}

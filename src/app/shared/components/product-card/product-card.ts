import {Component, inject, Input} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelector} from '../count-selector/count-selector';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../../core/auth/auth.service';
import {FavoriteService} from '../../services/favorite.service';
import type {ProductType} from '../../../../types/product.type';
import type {CartType} from '../../../../types/cart.type';
import type {DefaultResponseType} from '../../../../types/default-response.type';
import type {FavoriteType} from '../../../../types/favorite.type';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CountSelector,
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {

  private _snackBar = inject(MatSnackBar);

  @Input() product!: ProductType;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;

  constructor(private cartService: CartService,
              public authService: AuthService,
              private router: Router,
              private favoriteService: FavoriteService,
              ) {
  }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.countInCart = this.count;
      });
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.countInCart = 0;
        this.count = 1;
      });
  }

  updateFavorite() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');
      return;
    }

    if (this.product.isInFavorite) {
      this.favoriteService.removeFavorites(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message)
          }

          this.product.isInFavorite = false;
        })
    } else {
      this.favoriteService.addFavorite(this.product.id)
        .subscribe((data: FavoriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message)
          }

          this.product.isInFavorite = true;

        });
    }
  }

  navigate() {
    if (this.isLight) {
      this.router.navigate( ['/product/' + this.product.url]);
    }
  }

}


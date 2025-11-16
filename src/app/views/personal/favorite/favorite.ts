import {Component} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import type {FavoriteType} from '../../../../types/favorite.type';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';
import {RouterModule} from '@angular/router';
import {
  CountSelector
} from '../../../shared/components/count-selector/count-selector';
import {CartService} from '../../../shared/services/cart.service';
import type {CartType} from '../../../../types/cart.type';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [RouterModule, CountSelector],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss'
})
export class Favorite {

  products: FavoriteType[] = [];
  cart: CartType | null = null;
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit() {
    this.loadFavorites();
    this.loadCart();

    // this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
    //   if ((data as DefaultResponseType).error !== undefined) {
    //     const error = (data as DefaultResponseType).message;
    //     throw new Error(error);
    //   }
    //
    //   this.products = data as FavoriteType[];
    // });
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }
      this.products = data as FavoriteType[];
    });
  }

  loadCart() {
    this.cartService.getCart().subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        // Можно обработать ошибку, но не прерывать работу
        console.error('Ошибка загрузки корзины:', (data as DefaultResponseType).message);
        return;
      }
      this.cart = data as CartType;
    });
  }

  // Проверить, есть ли товар в корзине
  isProductInCart(productId: string): boolean {
    return this.getProductCountInCart(productId) > 0;
  }

  // Получить количество товара в корзине
  getProductCountInCart(productId: string): number {
    if (!this.cart) return 0;
    const cartItem = this.cart.items.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Добавить товар в корзину
  addToCart(productId: string) {
    this.cartService.updateCart(productId, 1).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart = data as CartType;
    });
  }

  // Обновить количество товара в корзине
  updateCartCount(productId: string, count: number) {
    this.cartService.updateCart(productId, count).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.cart = data as CartType;
    });
  }

  removeFromFavoritItems(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message)
        }

        this.products = this.products.filter(item => item.id !== id);
      })
  }
}

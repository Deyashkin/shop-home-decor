import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import type {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelector} from '../count-selector/count-selector';
import {CartService} from '../../services/cart.service';
import {subscribeOn} from 'rxjs';
import type {CartType} from '../../../../types/cart.type';

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

  @Input() product!: ProductType;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  @Input() isLight: boolean = false;
  @Input() countInCart: number | undefined = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.countInCart = this.count;
      });
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.countInCart = this.count;
        });
    }
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.countInCart = 0;
        this.count = 1;
      });
  }
}


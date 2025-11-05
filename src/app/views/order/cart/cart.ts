import { Component } from '@angular/core';
import {CountSelector} from '../../../shared/components/count-selector/count-selector';
import {RouterLink} from '@angular/router';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {ProductCard} from '../../../shared/components/product-card/product-card';

import {ProductService} from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';

import type {ProductType} from '../../../../types/product.type';
import type {CartType} from '../../../../types/cart.type';
import {environment} from '../../../../environments/environment';
import {count} from 'rxjs';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [CountSelector, RouterLink, CarouselModule, ProductCard],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {

  constructor(private productService: ProductService, private cartService: CartService) {
  }

  extraProducts: ProductType[] = [];

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  cart: CartType | null = null;
  serverStaticPath = environment.serverStaticPath;
  totalAmount: number = 0;
  totalCount: number = 0;

  ngOnInit() {
    this.productService.getBestProducts()
      .subscribe((data:ProductType[]) => {
        this.extraProducts = data;
      });

    this.cartService.getCart()
      .subscribe((data: CartType) => {
        this.cart = data;
        this.calculateTotal();
      })
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      })
    }
  }

  updateCount(id: string, count: number)  {
    if (this.cart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType) => {
          this.cart = data;
          this.calculateTotal();
        })
    }
  }

  protected readonly count = count;
}

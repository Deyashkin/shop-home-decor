import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {
  ProductCard
} from '../../../shared/components/product-card/product-card';
import {ProductService} from '../../../shared/services/product.service';
import {environment} from '../../../../environments/environment';
import {
  CountSelector
} from '../../../shared/components/count-selector/count-selector';
import {CartService} from '../../../shared/services/cart.service';
import type {ProductType} from '../../../../types/product.type';
import type {CartType} from '../../../../types/cart.type';
import {FavoriteService} from '../../../shared/services/favorite.service';
import type {FavoriteType} from '../../../../types/favorite.type';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CarouselModule, ProductCard, CarouselModule, CountSelector],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class Detail {

  count: number = 1;
  recommendedProducts: ProductType[] = [];
  product!: ProductType;
  serverStaticPath = environment.serverStaticPath;


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

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {

          this.cartService.getCart()
            .subscribe((cartData: CartType) => {
              if (cartData) {
                const productInCart = cartData.items.find(item => item.product.id === data.id);
                if (productInCart) {
                  data.countInCart = productInCart.quantity;
                  this.count = data.countInCart;
                }
              }

              this.product = data;
            })


          this.product = data;
        })
    })

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType) => {
          this.product.countInCart = this.count;
        });
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType) => {
        this.product.countInCart = this.count;
      });
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType) => {
        this.product.countInCart = 0;
        this.count = 1;
      });
  }

  addToFavorite() {
    this.favoriteService.addFavorite(this.product.id)
      .subscribe((data: FavoriteType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message)
        }

        this.product.isInFavorite = true;

      });
  }






}

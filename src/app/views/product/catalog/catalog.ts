import {Component} from '@angular/core';
import {debounceTime} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ProductCard
} from '../../../shared/components/product-card/product-card';
import {
  CategoryFilter
} from '../../../shared/components/category-filter/category-filter';
import {ActiveParamsUtil} from '../../../shared/utils/active-params-util';
import {CartService} from '../../../shared/services/cart.service';
import {ProductService} from '../../../shared/services/product.service';
import {CategoryService} from '../../../shared/services/category.service';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {AuthService} from '../../../core/auth/auth.service';
import type {
  CategoryWithTypeType
} from '../../../../types/category-with-type.type';
import type {ProductType} from '../../../../types/product.type';
import type {AppliedFilterType} from '../../../../types/applied-filter.type';
import type {ActiveParamsType} from '../../../../types/active-params.type';
import type {CartType} from '../../../../types/cart.type';
import type {
  ProductResponseType
} from '../../../../types/product-response.type';
import type {FavoriteType} from '../../../../types/favorite.type';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCard, CategoryFilter],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class Catalog {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen = false;
  sortingOptions: { name: string, value: string }[] = [
    {name: 'от А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'},
  ];
  pages: number[] = [];
  cart: CartType | null = null;
  favoriteProducts: FavoriteType[] | null = null;

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private router: Router,
              private favoriteService: FavoriteService,
              private authService: AuthService,) {
  };

  ngOnInit() {
    this.cartService.getCart()
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;

        // Убираем загрузку избранного для незалогиненных пользователей
        if (this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .subscribe(
              {
                next: (data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    this.processCatalog();
                    throw new Error(error);
                  }

                  this.favoriteProducts = data as FavoriteType[];
                  this.processCatalog();
                },
                error: (error) => {
                  this.processCatalog();
                }
              }
            );
        } else {
          // Для незалогиненных сразу обрабатываем каталог без избранного
          this.favoriteProducts = null;
          this.processCatalog();
        }

        if (this.authService.getIsLoggedIn()) {
          this.favoriteService.getFavorites()
            .subscribe(
              {
                next: (data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    this.processCatalog();
                    throw new Error(error);
                  }

                  this.favoriteProducts = data as FavoriteType[];
                  this.processCatalog();
                },
                error: (error) => {
                  this.processCatalog();
                }
              }
            );
        } else {
          this.processCatalog();
        }


      });
  }

  processCatalog() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
        this.categoriesWithTypes = data;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.appliedFilters = [];
            this.activeParams.types.forEach(url => {
              for (let i = 0; i < this.categoriesWithTypes.length; i++) {
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url)
                if (foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParam: foundType.url
                  });
                }
              }
            });

            if (this.activeParams.heightFrom) {
              this.appliedFilters.push({
                name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
                urlParam: 'heightFrom'
              });
            }

            if (this.activeParams.heightTo) {
              this.appliedFilters.push({
                name: 'Высота: до ' + this.activeParams.heightTo + ' см',
                urlParam: 'heightTo'
              });
            }

            if (this.activeParams.diameterFrom) {
              this.appliedFilters.push({
                name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
                urlParam: 'diameterFrom'
              });
            }

            if (this.activeParams.diameterTo) {
              this.appliedFilters.push({
                name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
                urlParam: 'diameterTo'
              });
            }

            this.productService.getProducts(this.activeParams)
              .subscribe((data: ProductResponseType) => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                if (this.cart && this.cart.items.length > 0) {
                  this.products = data.items.map(product => {
                    if (this.cart) {
                      const productInCart = this.cart.items.find(item => item.product.id === product.id)
                      if (productInCart) {
                        product.countInCart = productInCart.quantity;
                      }
                    }
                    return product;
                  })
                } else {
                  this.products = data.items;
                }

                if (this.favoriteProducts) {
                  this.products = this.products.map(product => {
                    const productInFavorite = this.favoriteProducts?.find(item => item.id === product.id);
                    if (productInFavorite) {
                      product.isInFavorite = true;
                    }
                    return product;
                  })
                }

              });
          });
      })
  }

  trackByFilter(index: number, filter: any): any {
    return filter.id || filter.name || index;
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParam === 'heightFrom' ||
      appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' ||
      appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string) {
    this.activeParams.sort = value;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  openPrewPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }


}

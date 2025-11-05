import {Component} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import type {FavoriteType} from '../../../../types/favorite.type';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';
import {environment} from '../../../../environments/environment';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './favorite.html',
  styleUrl: './favorite.scss'
})
export class Favorite {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      this.products = data as FavoriteType[];
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

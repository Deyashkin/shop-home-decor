import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './header/header';
import {Footer} from './footer/footer';
import type {CategoryType} from '../../../types/category.type';
import {CategoryService} from '../services/category.service';
import type {
  CategoryWithTypeType
} from '../../../types/category-with-type.type';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
  ],
  templateUrl: './layout.html',
})
export class Layout {
  categories: CategoryWithTypeType[] = [];

  constructor(private categoryService: CategoryService,) { }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypeType[]) => {
        this.categories = categories.map(item => {
          return Object.assign({typesUrl: item.types.map(item => item.url)}, item)
        });
      })
  }

}

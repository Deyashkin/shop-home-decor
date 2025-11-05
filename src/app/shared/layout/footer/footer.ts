import {Component, Input} from '@angular/core';
import type {CategoryType} from '../../../../types/category.type';
import {RouterModule} from '@angular/router';
import type {
  CategoryWithTypeType
} from '../../../../types/category-with-type.type';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  @Input() categories: CategoryWithTypeType[] = [];


}

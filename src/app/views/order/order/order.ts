import { Component } from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o';

@Component({
  selector: 'order',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order {

}

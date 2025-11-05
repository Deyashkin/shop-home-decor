import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductCard} from '../../shared/components/product-card/product-card';
import {ProductService} from '../../shared/services/product.service';
import type {ProductType} from '../../../types/product.type';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink, ProductCard, CarouselModule
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})


export class Main {

  products: ProductType[] = [];

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
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
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
    },
    nav: false
  }

  reviews = [
    {
      id: 1,
      name: 'Ирина',
      image: 'review-1.png',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях.'
    },
    {
      id: 2,
      name: 'Анастасия',
      image: 'review-2.png',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      id: 3,
      name: 'Илья',
      image: 'review-3.png',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      id: 4,
      name: 'Аделина',
      image: 'review-4.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
    {
      id: 5,
      name: 'Яника',
      image: 'review-5.jpg',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      id: 6,
      name: 'Марина',
      image: 'review-6.jpg',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      id: 7,
      name: 'Станислав',
      image: 'review-7.jpg',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    },
  ]

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getBestProducts()
    .subscribe((data:ProductType[]) => {
      this.products = data;
    })
  }

}




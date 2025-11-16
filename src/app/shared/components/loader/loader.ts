import {Component, type OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderService} from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,

  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements OnInit{

  isShowed: boolean = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed;
    });
  }

}

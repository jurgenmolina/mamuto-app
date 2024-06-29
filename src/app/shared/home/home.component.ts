import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  slides = [
    {
      id: 1,
      src: './assets/images/home1.jpg',
      title: 'Another Title',
      subtitle: 'Another subtitle...'
    },
    {
      id: 2,
      src: './assets/images/home2.jpg',
      title: 'Another Title',
      subtitle: 'Another subtitle...'
    },
    {
      id: 3,
      src: './assets/images/home3.jpg',
      title: 'Another Title',
      subtitle: 'Another subtitle...'
    }
  ];
}
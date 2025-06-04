import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [RouterOutlet , RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

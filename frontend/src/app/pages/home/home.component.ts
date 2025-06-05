import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "../../layouts/menu/menu.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}

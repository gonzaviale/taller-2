import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic can go here
  }

  onLogin(): void {
    // Handle login logic here
  }

  onRegister(): void {
    // Handle registration logic here
    this.router.navigate(['/register']);
  }
  

}

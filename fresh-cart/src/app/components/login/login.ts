import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;
  rememberMe = false;
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Please fill in all fields');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.loginData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.authService.setToken(res.token, res.user);
        this.isLoading.set(false);
        alert('Login successful!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login failed:', err);
        if (err.status === 401) {
          alert('Invalid email or password');
        } else {
          alert('Login failed. Please try again.');
        }
      }
    });
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  };

  showPassword = false;
  agreeToTerms = false;
  passwordStrength = '';
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  checkPasswordStrength(): void {
    const pwd = this.registerData.password;

    if (!pwd) {
      this.passwordStrength = '';
      return;
    }

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;

    if (score <= 1) this.passwordStrength = 'Weak';
    else if (score <= 3) this.passwordStrength = 'Medium';
    else this.passwordStrength = 'Strong';
  }

  onSubmit(): void {
    const { name, email, password, rePassword, phone } = this.registerData;

    if (!name || !email || !password || !rePassword || !phone) {
      alert('Please fill in all fields');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (password !== rePassword) {
      alert('Passwords do not match');
      return;
    }

    const phonePattern = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!phonePattern.test(phone)) {
      alert('Please enter a valid Egyptian phone number (e.g., 01012345678)');
      return;
    }

    if (!this.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Registration failed:', err);
        if (err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    });
  }
}

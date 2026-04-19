import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  authService = inject(AuthService);
  private http = inject(HttpClient);

  // Profile form
  profileData = {
    name: this.authService.userName(),
    email: this.authService.userEmail(),
    phone: '',
  };
  isSavingProfile = signal(false);
  profileSuccess = signal(false);

  // Password form
  passwordData = { currentPassword: '', password: '', rePassword: '' };
  showCurrentPw = signal(false);
  showNewPw = signal(false);
  showConfirmPw = signal(false);
  isChangingPw = signal(false);
  pwSuccess = signal(false);
  pwError = signal('');

  sidebarLinks = [
    { label: 'My Profile', route: '/profile', icon: 'fas fa-user' },
    { label: 'My Orders', route: '/orders', icon: 'fas fa-box' },
    { label: 'My Wishlist', route: '/wishlist', icon: 'fas fa-heart' },
    { label: 'Addresses', route: '/addresses', icon: 'fas fa-map-marker-alt' },
    { label: 'Settings', route: '/settings', icon: 'fas fa-cog' },
  ];

  saveProfile() {
    if (!this.profileData.name) { alert('Name is required.'); return; }
    this.isSavingProfile.set(true);
    this.profileSuccess.set(false);
    // Update local auth state
    setTimeout(() => {
      this.authService.setToken(localStorage.getItem('token') || '', {
        name: this.profileData.name,
        email: this.profileData.email,
      });
      this.isSavingProfile.set(false);
      this.profileSuccess.set(true);
      setTimeout(() => this.profileSuccess.set(false), 3000);
    }, 700);
  }

  changePassword() {
    this.pwError.set('');
    if (!this.passwordData.currentPassword || !this.passwordData.password || !this.passwordData.rePassword) {
      this.pwError.set('Please fill in all password fields.'); return;
    }
    if (this.passwordData.password.length < 6) {
      this.pwError.set('New password must be at least 6 characters.'); return;
    }
    if (this.passwordData.password !== this.passwordData.rePassword) {
      this.pwError.set('Passwords do not match.'); return;
    }
    this.isChangingPw.set(true);
    this.http.put('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', this.passwordData, {
      headers: { token: localStorage.getItem('token') || '' }
    }).subscribe({
      next: () => {
        this.isChangingPw.set(false);
        this.pwSuccess.set(true);
        this.passwordData = { currentPassword: '', password: '', rePassword: '' };
        setTimeout(() => this.pwSuccess.set(false), 3000);
      },
      error: (err) => {
        this.isChangingPw.set(false);
        this.pwError.set(err.error?.message || 'Failed to change password. Please try again.');
      }
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './profile.html',
})
export class ProfileComponent {
  authService = inject(AuthService);

  isEditing = signal(false);
  isSaving = signal(false);
  saveSuccess = signal(false);

  profileData = {
    name: this.authService.userName(),
    email: this.authService.userEmail(),
    phone: '',
  };

  editData = { ...this.profileData };

  startEdit() {
    this.editData = { ...this.profileData };
    this.isEditing.set(true);
    this.saveSuccess.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveProfile() {
    if (!this.editData.name || !this.editData.email) {
      alert('Name and email are required.');
      return;
    }
    this.isSaving.set(true);
    setTimeout(() => {
      this.profileData = { ...this.editData };
      this.isSaving.set(false);
      this.isEditing.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    }, 800);
  }

  sidebarLinks = [
    { label: 'My Profile', route: '/profile', icon: 'fas fa-user' },
    { label: 'My Orders', route: '/orders', icon: 'fas fa-box' },
    { label: 'My Wishlist', route: '/wishlist', icon: 'fas fa-heart' },
    { label: 'Addresses', route: '/addresses', icon: 'fas fa-map-marker-alt' },
    { label: 'Settings', route: '/settings', icon: 'fas fa-cog' },
  ];
}

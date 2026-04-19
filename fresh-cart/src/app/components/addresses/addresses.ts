import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AddressesService } from '../../services/addresses';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './addresses.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  private addressesService = inject(AddressesService);

  addresses = signal<any[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  isSaving = signal(false);
  deletingId = signal('');

  newAddress = { name: '', details: '', phone: '', city: '' };

  sidebarLinks = [
    { label: 'My Profile', route: '/profile', icon: 'fas fa-user' },
    { label: 'My Orders', route: '/orders', icon: 'fas fa-box' },
    { label: 'My Wishlist', route: '/wishlist', icon: 'fas fa-heart' },
    { label: 'Addresses', route: '/addresses', icon: 'fas fa-map-marker-alt' },
    { label: 'Settings', route: '/settings', icon: 'fas fa-cog' },
  ];

  constructor() {
    afterNextRender(() => this.loadAddresses());
  }

  loadAddresses() {
    this.isLoading.set(true);
    this.addressesService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.addresses.set([]);
        this.isLoading.set(false);
      }
    });
  }

  openForm() {
    this.newAddress = { name: '', details: '', phone: '', city: '' };
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
  }

  saveAddress() {
    if (!this.newAddress.name || !this.newAddress.details || !this.newAddress.phone || !this.newAddress.city) {
      alert('Please fill in all fields.');
      return;
    }
    this.isSaving.set(true);
    this.addressesService.addAddress(this.newAddress).subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.isSaving.set(false);
        this.showForm.set(false);
      },
      error: () => {
        alert('Failed to save address. Please try again.');
        this.isSaving.set(false);
      }
    });
  }

  deleteAddress(id: string) {
    this.deletingId.set(id);
    this.addressesService.removeAddress(id).subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.deletingId.set('');
      },
      error: () => {
        alert('Failed to delete address.');
        this.deletingId.set('');
      }
    });
  }
}

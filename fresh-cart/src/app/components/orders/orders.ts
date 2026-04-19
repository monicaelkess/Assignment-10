import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OrdersService } from '../../services/orders';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  private authService = inject(AuthService);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  orders = signal<any[]>([]);
  isLoading = signal(true);
  error = signal('');

  sidebarLinks = [
    { label: 'My Profile', route: '/profile', icon: 'fas fa-user' },
    { label: 'My Orders', route: '/orders', icon: 'fas fa-box' },
    { label: 'My Wishlist', route: '/wishlist', icon: 'fas fa-heart' },
    { label: 'Addresses', route: '/addresses', icon: 'fas fa-map-marker-alt' },
    { label: 'Settings', route: '/settings', icon: 'fas fa-cog' },
  ];

  constructor() {
    afterNextRender(() => {
      const userId = this.authService.userId();
      if (!userId) {
        this.isLoading.set(false);
        return;
      }
      this.ordersService.getUserOrders(userId).subscribe({
        next: (res) => {
          this.orders.set(Array.isArray(res) ? res : (res.data ?? []));
          this.isLoading.set(false);
        },
        error: () => {
          this.orders.set([]);
          this.isLoading.set(false);
        }
      });
    });
  }

  getStatusColor(order: any): string {
    if (order.isDelivered) return 'bg-emerald-100 text-emerald-700';
    if (order.isPaid) return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
  }

  getStatusLabel(order: any): string {
    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Processing';
    return 'Pending';
  }

  startShopping() {
    this.router.navigate(['/products']);
  }
}

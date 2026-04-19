import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cart = signal<any>(null);
  isLoading = signal(true);
  isUpdating = signal(false);

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Could not load cart:', err);
        this.isLoading.set(false);
        if (err.status === 401) {
          alert('Please login first!');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateQuantity(productId: string, count: number): void {
    if (count < 1) return;

    this.isUpdating.set(true);
    this.cartService.updateCount(productId, count).subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isUpdating.set(false);
      },
      error: (err) => {
        console.error('Could not update quantity:', err);
        this.isUpdating.set(false);
        alert('Failed to update quantity');
      }
    });
  }

  removeItem(productId: string): void {
    if (!confirm('Are you sure you want to remove this item?')) return;

    this.isUpdating.set(true);
    this.cartService.removeItem(productId).subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isUpdating.set(false);
        alert('Item removed from cart');
      },
      error: (err) => {
        console.error('Could not remove item:', err);
        this.isUpdating.set(false);
        alert('Failed to remove item');
      }
    });
  }

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    this.isUpdating.set(true);
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set(null);
        this.isUpdating.set(false);
        alert('Cart cleared successfully');
      },
      error: (err) => {
        console.error('Could not clear cart:', err);
        this.isUpdating.set(false);
        alert('Failed to clear cart');
      }
    });
  }

  getCartItemsCount(): number {
    return this.cart()?.products?.length || 0;
  }

  getTotalPrice(): number {
    return this.cart()?.totalCartPrice || 0;
  }

  getSubtotal(): number {
    return this.cart()?.totalCartPrice || 0;
  }

  getShipping(): number {
    return this.getTotalPrice() > 100 ? 0 : 10;
  }

  getTax(): number {
    return this.getSubtotal() * 0.1;
  }

  getFinalTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }

  checkout(): void {
    if (!this.cart()?.products?.length) {
      alert('Your cart is empty!');
      return;
    }
    alert('Checkout feature coming soon!');
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}

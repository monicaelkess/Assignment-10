import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class WishlistComponent implements OnInit {
  wishlist = signal<any[]>([]);
  isLoading = signal(true);
  isUpdating = signal(false);

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Could not load wishlist:', err);
        this.isLoading.set(false);
        if (err.status === 401) {
          alert('Please login first!');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  removeFromWishlist(productId: string): void {
    this.isUpdating.set(true);
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: (res) => {
        this.wishlist.set(res.data || []);
        this.isUpdating.set(false);
        alert('Product removed from wishlist');
      },
      error: (err) => {
        console.error('Could not remove from wishlist:', err);
        this.isUpdating.set(false);
        alert('Failed to remove from wishlist');
      }
    });
  }

  addToCart(productId: string): void {
    this.isUpdating.set(true);
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.isUpdating.set(false);
        alert('Product added to cart!');
      },
      error: (err) => {
        console.error('Could not add to cart:', err);
        this.isUpdating.set(false);
        if (err.status === 401) {
          alert('Please login first!');
          this.router.navigate(['/login']);
        } else {
          alert('Failed to add to cart');
        }
      }
    });
  }

  addToCartAndRemove(productId: string): void {
    this.isUpdating.set(true);
    this.cartService.addToCart(productId).subscribe({
      next: () => this.removeFromWishlist(productId),
      error: (err) => {
        console.error('Could not add to cart:', err);
        this.isUpdating.set(false);
        alert('Failed to add to cart');
      }
    });
  }

  clearWishlist(): void {
    if (!confirm('Are you sure you want to clear your wishlist?')) return;

    this.isUpdating.set(true);
    const ids = this.wishlist().map(p => p._id);
    let done = 0;

    ids.forEach(id => {
      this.wishlistService.removeFromWishlist(id).subscribe({
        next: () => {
          done++;
          if (done === ids.length) {
            this.wishlist.set([]);
            this.isUpdating.set(false);
            alert('Wishlist cleared successfully');
          }
        },
        error: (err) => {
          console.error('Error clearing wishlist:', err);
          this.isUpdating.set(false);
        }
      });
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  getWishlistCount(): number {
    return this.wishlist().length;
  }
}

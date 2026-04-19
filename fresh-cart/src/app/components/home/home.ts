import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  currentSlide = signal(0);
  isLoading = signal(true);
  private slideInterval: any;

  slides = [
    {
      title: 'Fresh Products Delivered to your Door',
      subtitle: 'Get 20% off your first order',
      bg: 'from-emerald-600 to-emerald-800'
    },
    {
      title: 'Premium Quality Guaranteed',
      subtitle: 'Fresh from farm to your table',
      bg: 'from-teal-600 to-teal-800'
    },
    {
      title: 'Fast & Free Delivery',
      subtitle: 'Same day delivery available',
      bg: 'from-green-600 to-green-800'
    }
  ];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.startSlider();
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  startSlider() {
    this.slideInterval = setInterval(() => {
      this.currentSlide.update(val => (val + 1) % this.slides.length);
    }, 4000);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadCategories() {
    this.productsService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data),
    });
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastService.success('Added to cart!');
      },
      error: () => this.toastService.error('Could not add to cart. Please try again.')
    });
  }

  addToWishlist(productId: string) {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        this.wishlistService.wishlistItems.set(res.data);
        this.toastService.success('Added to wishlist!');
      },
      error: () => this.toastService.error('Could not add to wishlist.')
    });
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  getDiscount(price: number, afterDiscount: number): number {
    return Math.round(((price - afterDiscount) / price) * 100);
  }
}

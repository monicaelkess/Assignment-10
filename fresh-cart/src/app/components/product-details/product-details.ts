import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {
  product = signal<any>(null);
  relatedProducts = signal<any[]>([]);
  isLoading = signal(true);
  selectedImage = signal('');
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) this.loadProduct(id);
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productsService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.selectedImage.set(res.data.imageCover);
        this.loadRelatedProducts(res.data.category._id);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Could not load product:', err);
        this.isLoading.set(false);
        alert('Product not found!');
        this.router.navigate(['/products']);
      }
    });
  }

  loadRelatedProducts(categoryId: string): void {
    this.productsService.getProducts().subscribe({
      next: (res) => {
        const related = res.data
          .filter((p: any) => p.category._id === categoryId && p._id !== this.product()?._id)
          .slice(0, 4);
        this.relatedProducts.set(related);
      },
      error: (err) => console.error('Could not load related products:', err)
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  increaseQuantity(): void {
    if (this.quantity < 10) this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    const productId = this.product()?._id;
    if (!productId) return;

    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(productId).subscribe({
        next: () => {
          if (i === this.quantity - 1) {
            alert(`${this.quantity} item(s) added to cart!`);
            this.quantity = 1;
          }
        },
        error: (err) => {
          if (err.status === 401) {
            alert('Please login first!');
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  addToWishlist(): void {
    const productId = this.product()?._id;
    if (!productId) return;

    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => alert('Product added to wishlist!'),
      error: (err) => {
        if (err.status === 401) {
          alert('Please login first!');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  isInWishlist(): boolean {
    const id = this.product()?._id;
    return id ? this.wishlistService.wishlistItems().includes(id) : false;
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  isStarFilled(star: number, rating: number): boolean {
    return star <= Math.floor(rating);
  }

  isStarHalf(star: number, rating: number): boolean {
    return star === Math.ceil(rating) && rating % 1 !== 0;
  }
}

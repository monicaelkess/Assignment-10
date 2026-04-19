import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  products = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  isLoading = signal(true);

  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  minPrice = 0;
  maxPrice = 10000;
  sortBy = 'default';

  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();

    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.selectedBrand = params['brand'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      this.applyFilters();
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (response) => this.categories.set(response.data),
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadBrands(): void {
    this.productsService.getBrands().subscribe({
      next: (response) => this.brands.set(response.data),
      error: (err) => console.error('Failed to load brands:', err)
    });
  }

  applyFilters(): void {
    let filtered = [...this.products()];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(term));
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category._id === this.selectedCategory);
    }

    if (this.selectedBrand) {
      filtered = filtered.filter(p => p.brand._id === this.selectedBrand);
    }

    filtered = filtered.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
    }

    this.filteredProducts.set(filtered);
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.sortBy = 'default';
    this.applyFilters();
  }

  addToCart(productId: string): void {
    this.cartService.addToCart(productId).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => {
        if (err.status === 401) {
          alert('Please login first!');
        } else {
          console.error('Could not add to cart:', err);
        }
      }
    });
  }

  addToWishlist(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => alert('Product added to wishlist!'),
      error: (err) => {
        if (err.status === 401) {
          alert('Please login first!');
        } else {
          console.error('Could not add to wishlist:', err);
        }
      }
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.wishlistItems().includes(productId);
  }
}

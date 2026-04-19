import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ProductsService } from '../../services/products';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private router = inject(Router);
  private productsService = inject(ProductsService);
  authService = inject(AuthService);
  cartService = inject(CartService);

  isMobileMenuOpen = signal(false);
  isCategoriesOpen = signal(false);
  isProfileOpen = signal(false);
  searchQuery = '';

  categories = signal<any[]>([]);

  constructor() {
    afterNextRender(() => {
      this.productsService.getCategories()
        .pipe(map(res => res.data))
        .subscribe(data => this.categories.set(data));
    });
  }

  navLinks: NavLink[] = [
    { label: 'Home', route: '/home' },
    { label: 'Shop', route: '/products' },
  ];

  afterCategoryLinks: NavLink[] = [
    { label: 'Brands', route: '/brands' },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  toggleCategories() {
    this.isCategoriesOpen.update(val => !val);
  }

  toggleProfile() {
    this.isProfileOpen.update(val => !val);
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }

  logout() {
    this.authService.logout();
    this.isProfileOpen.set(false);
    this.router.navigate(['/login']);
  }
}

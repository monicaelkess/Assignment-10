import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  categories = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.productsService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Could not load categories:', err);
        this.isLoading.set(false);
      }
    });
  }

  getCategoriesCount(): number {
    return this.categories().length;
  }
}

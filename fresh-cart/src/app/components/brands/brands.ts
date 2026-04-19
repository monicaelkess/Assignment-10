import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.html',
  styleUrls: ['./brands.css']
})
export class BrandsComponent implements OnInit {
  brands = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    this.productsService.getBrands().subscribe({
      next: (res) => {
        this.brands.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Could not load brands:', err);
        this.isLoading.set(false);
      }
    });
  }

  getBrandsCount(): number {
    return this.brands().length;
  }
}

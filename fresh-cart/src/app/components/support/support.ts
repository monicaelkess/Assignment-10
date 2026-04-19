import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export class SupportComponent {
  formData = {
    fullName: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = signal(false);

  subjects = [
    'Select a subject',
    'General Inquiry',
    'Order Support',
    'Product Question',
    'Technical Support',
    'Billing & Payment',
    'Returns & Refunds',
    'Partnership',
    'Other'
  ];

  onSubmit(): void {
    if (!this.formData.fullName || !this.formData.email ||
        !this.formData.subject || this.formData.subject === 'Select a subject' ||
        !this.formData.message) {
      alert('Please fill in all fields');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');

      this.formData = {
        fullName: '',
        email: '',
        subject: '',
        message: ''
      };

      this.isSubmitting.set(false);
    }, 1000);
  }
}

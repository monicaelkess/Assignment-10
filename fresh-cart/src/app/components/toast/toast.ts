import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm pointer-events-auto animate-fade-in"
          [ngClass]="{
            'bg-emerald-600': toast.type === 'success',
            'bg-red-600':     toast.type === 'error',
            'bg-blue-600':    toast.type === 'info',
            'bg-amber-500':   toast.type === 'warning'
          }"
        >
          <i class="fas flex-shrink-0"
            [ngClass]="{
              'fa-check-circle':       toast.type === 'success',
              'fa-times-circle':       toast.type === 'error',
              'fa-info-circle':        toast.type === 'info',
              'fa-exclamation-circle': toast.type === 'warning'
            }"
          ></i>
          <span class="flex-1">{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="ml-2 opacity-70 hover:opacity-100 flex-shrink-0"
            aria-label="Dismiss"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}

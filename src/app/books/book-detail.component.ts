import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <button
        (click)="goBack()"
        class="mb-6 flex items-center text-blue-700 hover:text-blue-800 font-medium transition-colors"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Books
      </button>

      <div *ngIf="loading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div
            class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-red-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-xl font-semibold text-red-700 mb-2">Error Loading Book</h2>
        <p class="text-red-600">{{ error }}</p>
        <button
          (click)="goBack()"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Return to Book List
        </button>
      </div>

      <div *ngIf="book && !loading" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3 bg-gray-100 p-8 flex items-center justify-center">
            <img
              *ngIf="book.cover"
              [src]="book.cover"
              [alt]="book.title"
              class="max-w-full h-auto rounded-lg shadow-md"
            />
            <div
              *ngIf="!book.cover"
              class="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg"
            >
              <span class="text-gray-500 text-lg font-medium">No cover available</span>
            </div>
          </div>

          <div class="md:w-2/3 p-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
            <p *ngIf="book.subtitle" class="text-xl text-gray-600 mb-4">{{ book.subtitle }}</p>

            <div class="border-t border-gray-200 pt-4 mb-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Author</p>
                  <p class="text-lg font-medium text-blue-700">{{ book.author }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Publisher</p>
                  <p class="text-lg font-medium text-gray-700">{{ book.publisher }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">ISBN</p>
                  <p class="text-lg font-medium text-gray-700">{{ book.isbn }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Pages</p>
                  <p class="text-lg font-medium text-gray-700">{{ book.numPages }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">Price</p>
                  <p class="text-lg font-medium text-green-600">{{ book.price }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-2xl font-semibold text-gray-800 mb-3">Description</h2>
              <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ book.abstract }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookApiClient: BookApiClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
    } else {
      this.error = 'No book ID provided';
      this.loading = false;
    }
  }

  private loadBook(id: string): void {
    this.loading = true;
    this.bookApiClient.getBook(id).subscribe({
      next: book => {
        this.book = book;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching book:', error);
        this.error = 'Failed to load book details. The book may not exist.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

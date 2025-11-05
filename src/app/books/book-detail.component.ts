import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
        <!-- Success Message -->
        <div
          *ngIf="saveSuccess"
          class="bg-green-50 border border-green-200 rounded-lg p-4 m-6 flex items-center justify-between"
        >
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-green-700 font-medium">Book updated successfully!</span>
          </div>
          <button (click)="saveSuccess = false" class="text-green-600 hover:text-green-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Save Error Message -->
        <div
          *ngIf="saveError"
          class="bg-red-50 border border-red-200 rounded-lg p-4 m-6 flex items-center justify-between"
        >
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-red-700 font-medium">{{ saveError }}</span>
          </div>
          <button (click)="saveError = null" class="text-red-600 hover:text-red-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

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
            <!-- View Mode -->
            <div *ngIf="!isEditMode">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
                  <p *ngIf="book.subtitle" class="text-xl text-gray-600 mb-4">{{ book.subtitle }}</p>
                </div>
                <button
                  (click)="enterEditMode()"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Edit
                </button>
              </div>

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

            <!-- Edit Mode -->
            <div *ngIf="isEditMode">
              <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
                <div class="flex justify-between items-start mb-6">
                  <h2 class="text-3xl font-bold text-gray-800">Edit Book Details</h2>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      (click)="cancelEdit()"
                      [disabled]="saving"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      [disabled]="!editForm.valid || saving"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <svg
                        *ngIf="saving"
                        class="animate-spin h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Title <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="title"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-500]="editForm.get('title')?.invalid && editForm.get('title')?.touched"
                    />
                    <p
                      *ngIf="editForm.get('title')?.invalid && editForm.get('title')?.touched"
                      class="text-red-500 text-sm mt-1"
                    >
                      Title is required
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      formControlName="subtitle"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Author <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="author"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-500]="editForm.get('author')?.invalid && editForm.get('author')?.touched"
                    />
                    <p
                      *ngIf="editForm.get('author')?.invalid && editForm.get('author')?.touched"
                      class="text-red-500 text-sm mt-1"
                    >
                      Author is required
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Publisher <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="publisher"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-500]="editForm.get('publisher')?.invalid && editForm.get('publisher')?.touched"
                    />
                    <p
                      *ngIf="editForm.get('publisher')?.invalid && editForm.get('publisher')?.touched"
                      class="text-red-500 text-sm mt-1"
                    >
                      Publisher is required
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        ISBN <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="isbn"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        [class.border-red-500]="editForm.get('isbn')?.invalid && editForm.get('isbn')?.touched"
                      />
                      <p
                        *ngIf="editForm.get('isbn')?.invalid && editForm.get('isbn')?.touched"
                        class="text-red-500 text-sm mt-1"
                      >
                        ISBN is required
                      </p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Pages <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        formControlName="numPages"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        [class.border-red-500]="editForm.get('numPages')?.invalid && editForm.get('numPages')?.touched"
                      />
                      <p
                        *ngIf="editForm.get('numPages')?.invalid && editForm.get('numPages')?.touched"
                        class="text-red-500 text-sm mt-1"
                      >
                        <span *ngIf="editForm.get('numPages')?.hasError('required')">Pages is required</span>
                        <span *ngIf="editForm.get('numPages')?.hasError('min')">Pages must be at least 1</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Price <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="price"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-500]="editForm.get('price')?.invalid && editForm.get('price')?.touched"
                    />
                    <p
                      *ngIf="editForm.get('price')?.invalid && editForm.get('price')?.touched"
                      class="text-red-500 text-sm mt-1"
                    >
                      Price is required
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cover URL</label>
                    <input
                      type="text"
                      formControlName="cover"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Description <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      formControlName="abstract"
                      rows="6"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [class.border-red-500]="editForm.get('abstract')?.invalid && editForm.get('abstract')?.touched"
                    ></textarea>
                    <p
                      *ngIf="editForm.get('abstract')?.invalid && editForm.get('abstract')?.touched"
                      class="text-red-500 text-sm mt-1"
                    >
                      Description is required
                    </p>
                  </div>
                </div>
              </form>
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
  isEditMode: boolean = false;
  editForm!: FormGroup;
  saving: boolean = false;
  saveSuccess: boolean = false;
  saveError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookApiClient: BookApiClient,
    private fb: FormBuilder
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
        this.initializeForm();
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching book:', error);
        this.error = 'Failed to load book details. The book may not exist.';
        this.loading = false;
      }
    });
  }

  private initializeForm(): void {
    if (!this.book) return;

    this.editForm = this.fb.group({
      title: [this.book.title, Validators.required],
      subtitle: [this.book.subtitle],
      author: [this.book.author, Validators.required],
      publisher: [this.book.publisher, Validators.required],
      isbn: [this.book.isbn, Validators.required],
      numPages: [this.book.numPages, [Validators.required, Validators.min(1)]],
      price: [this.book.price, Validators.required],
      cover: [this.book.cover],
      abstract: [this.book.abstract, Validators.required]
    });
  }

  enterEditMode(): void {
    this.isEditMode = true;
    this.saveSuccess = false;
    this.saveError = null;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initializeForm(); // Reset form to original values
    this.saveError = null;
  }

  saveChanges(): void {
    if (this.editForm.invalid || !this.book) return;

    this.saving = true;
    this.saveError = null;
    this.saveSuccess = false;

    const updatedBook: Book = {
      ...this.book,
      ...this.editForm.value
    };

    this.bookApiClient.updateBook(this.book.id, updatedBook).subscribe({
      next: book => {
        this.book = book;
        this.saving = false;
        this.isEditMode = false;
        this.saveSuccess = true;
        this.initializeForm(); // Update form with new values

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.saveSuccess = false;
        }, 5000);
      },
      error: error => {
        console.error('Error updating book:', error);
        this.saveError = 'Failed to save changes. Please try again.';
        this.saving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

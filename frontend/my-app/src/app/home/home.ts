import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../services/items';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { Item } from '../models/item';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  items: Item[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  hasMoreItems: boolean = true; // True if last fetch returned full page
  addItemForm!: FormGroup;
  showAddItemPanel: boolean = false;
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  maxPrice: number | null = null;
  minPrice: number | null = null;
  showFilters: boolean = false;
  isLoading: boolean = false;
  private searchSubject = new Subject<string>();


  constructor(
    private itemsService: ItemsService,
    public translate: TranslateService,
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchItems();
    this.auth.loggedIn$.subscribe(val => this.isLoggedIn = val);

    // ✅ Automatically search with debounce
    this.searchSubject.pipe(
      debounceTime(400),            // wait 400ms after the user stops typing
      distinctUntilChanged(),       // only search if the value changed
      switchMap((query) => {
        this.isLoading = true;
        if (!query.trim()) {
          // 🔙 If input empty → reset pagination + fetch normal items
          this.currentPage = 1;
          this.isLoading = true;
          return this.itemsService.getItems(this.itemsPerPage, 0);
        }
        this.isLoading = true;
        return this.itemsService.searchItems(query);
      })
    ).subscribe({
      next: (res: any) => {
        this.items = res.results || res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  fetchItems(): void {
    const offset = (this.currentPage - 1) * this.itemsPerPage;
    this.itemsService.getItems(this.itemsPerPage, offset).subscribe({
      next: (data) => {
        this.items = data;             // replace list with the current page
        this.hasMoreItems = data.length === this.itemsPerPage;
      },
      error: (err) => console.error(err),
    });
  }

  nextPage(): void {
      if (this.hasMoreItems) {
      this.currentPage++;
      this.fetchItems();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchItems();
    }
  }

  goToAddItem(): void {
    this.router.navigate(['/add-item']);
  }

  goToItem(itemId: number) {
    this.router.navigate(['/item-details', itemId]);
  }

  toggleFiltersPanel(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {}
  
    // ✅ Search functionality
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.currentPage = 1;
      this.fetchItems();
      return;
    }

    this.isLoading = true;
    this.itemsService.searchItems(this.searchQuery).subscribe({
      next: (response) => {
        this.items = response.results || response;  // depends on your API format
        this.hasMoreItems = false; // disable pagination during search
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

}

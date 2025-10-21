import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../services/items';
import { firstValueFrom } from 'rxjs';
import { Item } from '../../models/item';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-details',
  standalone: true,
  templateUrl: './item-details.html',
  styleUrls: ['./item-details.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ItemDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemsService);

  public item?: Item;
  public currentSlide = 0;

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItemById(id).subscribe((item) => {
      this.item = item;
    });
  }

  deleteItem() {
    if (!this.item?.id) return;
    if (confirm('Are you sure you want to delete this item?')) {
      firstValueFrom(this.itemService.deleteItem(this.item.id)).then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  editItem() {
    if (this.item?.id) {
      this.router.navigate(['/items', this.item.id, 'edit']);
    }
  }

  nextSlide() {
    if (!this.item?.photos?.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.item.photos.length;
  }

  prevSlide() {
    if (!this.item?.photos?.length) return;
    this.currentSlide =
      (this.currentSlide - 1 + this.item.photos.length) % this.item.photos.length;
  }
}

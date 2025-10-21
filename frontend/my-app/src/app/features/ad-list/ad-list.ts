// src/app/components/ad-list/ad-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-list.html',
  styleUrls: ['./ad-list.css']
})
export class AdList implements OnInit {
  ads: any[] = [];
  isLoggedIn = false;

  constructor(
    private api: Api,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    // subscribe to auth status
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      // possibly refresh ads to show contact info if login status changed
      this.loadAds();
    });

    // initial load
    this.loadAds();
  }

  loadAds(): void {
    this.api.getAds().subscribe({
      next: (res: any[]) => {
        this.ads = res;
      },
      error: (err) => {
        console.error('Error fetching ads', err);
      }
    });
  }
}

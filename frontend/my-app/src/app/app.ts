import { Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID, Signal, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Auth } from './services/auth';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    TranslatePipe,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatOptionModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit{
  protected title!: Signal<string>;

  showLogin = false;
  showRegister = false;
  currentLang = 'en';

  // Registration form model
  reg = {
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordError: string | null = null;
  phoneError: string | null = null;

  ads = [
    { imageUrl: 'https://via.placeholder.com/150', text: 'Ad 1' },
    { imageUrl: 'https://via.placeholder.com/150', text: 'Ad 2' },
    { imageUrl: 'https://via.placeholder.com/150', text: 'Ad 3' }
  ];

  constructor(
    public authService: Auth, 
    @Inject(PLATFORM_ID) private platformId: Object,
    public translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang');
      const browserLang = this.translate.getBrowserLang();
      const lang = savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'ar');

      this.currentLang = lang;
      this.translate.use(lang).subscribe({
        next: () => {
          document.documentElement.setAttribute('lang', lang);
          document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        },
        error: err => console.error('Failed to load translation:', err)
      });
    }
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  onLanguageChange(event: MatSelectChange) {
    const value = event.value; // directly get the selected value
    this.switchLanguage(value);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  openLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }

  openRegister() {
    this.showRegister = true;
    this.showLogin = false;
  }

  closePanels() {
    this.showLogin = false;
    this.showRegister = false;
    // Reset form and errors
    this.reg = { username: '', phone: '', email: '', password: '', confirmPassword: '' };
    this.passwordError = null;
    this.phoneError = null;
  }

  // Real-time validation
  validatePasswords() {
    const { password, confirmPassword } = this.reg;

    // Strong password regex
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*=])[A-Za-z\d!@#$%^&*=]{8,}$/;

    if (password && !strongPassword.test(password)) {
      this.passwordError = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    } else if (password && confirmPassword && password !== confirmPassword) {
      this.passwordError = 'Passwords do not match';
    } else {
      this.passwordError = null;
    }
  }

  validatePhone() {
    const phonePattern = /^[0-9]{8,15}$/;
    if (!phonePattern.test(this.reg.phone)) {
      this.phoneError = 'Phone number must be 8-15 digits';
    } else {
      this.phoneError = null;
    }
  }

// Login form
  login(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    // Call the login method from AuthService
    this.authService.login(username, password).subscribe({
      next: () => {
        this.closePanels();
        alert('Login successful!');
      },
      error: (err) => {
        console.error('Login failed:', err); // Log error for debugging
        alert('Login failed: ' + err.message);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Clear session and redirect or update UI
        this.authService.clearSession();
        alert('Logout successful!');
      },
      error: (err) => {
        console.error('Logout failed:', err); // Log error for debugging
        alert('Logout failed: ' + err.message);
      },
    });
  }

  // Registration form with real-time validation
  register(event: Event) {
    event.preventDefault();

    if (this.passwordError || this.phoneError) {
      return;
    }

    const payload = {
      username: this.reg.username,
      phone: this.reg.phone,
      email: this.reg.email || undefined,
      password: this.reg.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.closePanels();
        alert('Registration successful!');
      },
      error: (err) => alert('Registration failed: ' + err.message)
    });
  }

  goToAdminPage() {
    this.router.navigate(['/admin']);
  }
}

import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    private cdr = inject(ChangeDetectorRef);
  protected readonly title = signal('angular');
  private router = inject(Router);

  showLayout = false;

  private readonly publicRoutes = ['/login', '/onboard', '/'];

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects.split('?')[0];
      this.showLayout = !this.publicRoutes.includes(url);
        this.cdr.detectChanges();
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  // Title of the application
  title = 'bigdeals';
  
  // Flag to determine whether to show the top navigation bar and layout wrapper
  showTopbar = true;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    // Monitor routing events to hide the topbar on authentication pages and update layout
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showTopbar = !event.url.startsWith('/auth');
      this.refreshLayout();
    });

    this.showTopbar = !this.router.url.startsWith('/auth');
  }

  /**
   * Called when the component initializes.
   */
  ngOnInit(): void {
    // Debug: Monitor storage
    setInterval(() => {
        console.log('--- STORAGE MONITOR ---');
        console.log('currentUser:', localStorage.getItem('currentUser'));
        console.log('token:', localStorage.getItem('token'));
        console.log('sessionStorage currentUser:', sessionStorage.getItem('currentUser'));
    }, 5000);

    // Subscribe to current user to toggle layout dynamically
    this.authService.currentUser$.subscribe(user => {
      this.refreshLayout();
    });

    // Set default theme and direction
    document.body.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'fr');
    document.body.setAttribute('data-layout-direction', 'ltr');
    this.loadLTRStyles();
  }

  /**
   * Evaluates the current state (User + Route) to set the correct layout attributes.
   */
  refreshLayout() {
    const user = this.authService.currentUserValue;
    const url = this.router.url;
    
    let isVertical = false;

    if (user) {
      if (user.role === 'ADMIN') {
        isVertical = true; // Admin is always vertical
      } else if (user.role === 'ANNONCEUR') {
        // Announcer is vertical ONLY when in the announcer dashboard area
        isVertical = url.startsWith('/announcer');
      }
    }

    this.applyLayout(isVertical);
  }

  /**
   * Applies the layout attributes to the DOM.
   */
  applyLayout(isVertical: boolean) {
    const layout = isVertical ? 'vertical' : 'horizontal';
    document.documentElement.setAttribute('data-layout', layout);
    document.body.setAttribute('data-layout', layout);
    
    if (isVertical) {
      document.documentElement.setAttribute('data-sidebar', 'dark');
      document.documentElement.setAttribute('data-sidebar-size', 'lg');
    } else {
      // Cleanup sidebar attributes for horizontal mode
      document.documentElement.removeAttribute('data-sidebar');
      document.documentElement.removeAttribute('data-sidebar-size');
    }
  }

  /**
   * Toggles the sidebar visibility.
   * - On Desktop (>768px): Toggles between 'lg' (Large) and 'sm' (Small/Minified).
   * - On Mobile (<768px): Toggles the 'vertical-sidebar-enable' class for the overlay menu.
   */
  onToggleMobileMenu() {
    const width = window.innerWidth;
    if (width > 850) {
      const currentSize = document.documentElement.getAttribute('data-sidebar-size');
      const newSize = currentSize === 'sm' ? 'lg' : 'sm';
      document.documentElement.setAttribute('data-sidebar-size', newSize);
    } else {
      document.body.classList.toggle('vertical-sidebar-enable');
    }
  }

  get isAdmin(): boolean {
    return this.authService.currentUserValue?.role === 'ADMIN';
  }

  get shouldShowSidebar(): boolean {
    const user = this.authService.currentUserValue;
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'ANNONCEUR' && this.router.url.startsWith('/announcer')) return true;
    return false;
  }

  get shouldShowPublicFooter(): boolean {
    const url = this.router.url;
    return !url.startsWith('/admin') && !url.startsWith('/announcer');
  }

  /**
   * Loads the Standard Left-To-Right CSS files.
   */
  loadLTRStyles() {
    this.replaceCSS('bootstrap', 'assets/css/bootstrap.min.css');
    this.replaceCSS('app', 'assets/css/app.min.css');
  }

  /**
   * A helper method that replaces the href attribute of a `<link>` tag 
   * in the document head dynamically to switch stylesheets.
   * 
   * @param id The HTML id of the link element (e.g. 'bootstrap')
   * @param href The path to the new CSS file
   */
  replaceCSS(id: string, href: string) {
    const link = document.getElementById(id) as HTMLLinkElement;
    if (link) {
      link.href = href;
    }
  }
}

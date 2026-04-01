import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

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
    public translate: TranslateService, 
    private router: Router
  ) {
    // Subscribe to translation language changes to update page layout direction (LTR/RTL)
    this.translate.onLangChange.subscribe((event) => {
      this.updateDirection(event.lang);
    });

    // Monitor routing events to hide the topbar on authentication pages (e.g. login, signup)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showTopbar = !event.url.startsWith('/auth');
    });

    // Check the current route on initial load to set the topbar state immediately
    this.showTopbar = !this.router.url.startsWith('/auth');
  }

  /**
   * Called when the component initializes.
   * We use it here to set default global layout attributes on the document body.
   */
  ngOnInit(): void {
    // Set horizontal layout across the application globally
    document.documentElement.setAttribute('data-layout', 'horizontal');
    document.body.setAttribute('data-layout', 'horizontal');
    // Set light theme globally
    document.body.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

  /**
   * Updates the HTML direction and styling tags to support Left-to-Right (LTR) 
   * and Right-to-Left (RTL) views based on the selected language.
   * 
   * @param lang The currently selected language code ('ar', 'en', 'fr', etc.)
   */
  updateDirection(lang: string) {
    const html = document.documentElement;
    const body = document.body;

    if (lang === 'ar') {
      // Configuration for Arabic language (RTL)
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      body.setAttribute('data-layout-direction', 'rtl');
      this.loadRTLStyles();
    } else {
      // Default to Left-To-Right for English, French, etc.
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
      body.setAttribute('data-layout-direction', 'ltr');
      this.loadLTRStyles();
    }
  }

  /**
   * Loads the Right-To-Left specific CSS files.
   */
  loadRTLStyles() {
    this.replaceCSS('bootstrap', 'assets/css/bootstrap-rtl.min.css');
    this.replaceCSS('app', 'assets/css/app-rtl.min.css');
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

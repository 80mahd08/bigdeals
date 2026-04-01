import { Component, OnInit, OnDestroy, EventEmitter, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Language / Cookie Services
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../core/services/event.service';

// Auth
import { AuthenticationService } from '../../core/services/auth.service';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-topbar-user',
  templateUrl: './topbaruser.component.html',
  styleUrls: ['./topbaruser.component.scss'],
  standalone: false
})
export class TopbarUserComponent implements OnInit, OnDestroy {

  // The HTML document element (used for fullscreen operations)
  element: any;

  // Current display mode ('light' | 'dark')
  mode: string | undefined;

  // Emitted when the mobile hamburger menu button is clicked
  @Output() mobileMenuButtonClicked = new EventEmitter();

  // Language / flag values for the language selector dropdown
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;

  // Tracks whether any dropdown is open
  isDropdownOpen = false;

  // The currently logged-in user (null if visitor/not authenticated)
  currentUser: User | null = null;

  // Used to clean up subscriptions when the component is destroyed
  private destroy$ = new Subject<void>();

  // Available languages for the language switcher dropdown
  listLang = [
    { text: 'English',  flag: 'assets/images/flags/gb.svg',     lang: 'en' },
    { text: 'Français', flag: 'assets/images/flags/cp.svg',  lang: 'fr' },
    { text: 'العربية',  flag: 'assets/images/flags/tn.svg',      lang: 'ar' },
  ];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public languageService: LanguageService,
    public cookiesService: CookieService,
    public translate: TranslateService,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.element = document.documentElement;

    // Initialize language selector from stored cookie
    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(e => e.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(e => e.flag);
    }

    // Subscribe to the current user observable to reactively toggle the topbar UI
    // between visitor buttons (Se connecter / S'inscrire) and user widget (Profile / Logout)
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Dispatches the logout operation via AuthenticationService.
   * The service clears sessionStorage and Firebase session; the Effect navigates to /auth/signin.
   */
  onLogout() {
    this.authService.logout().subscribe();
  }

  /**
   * Returns the display name of the current user.
   * Falls back to email or a generic label if name is unavailable.
   */
  get displayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.username ?? this.currentUser.email ?? 'Mon compte';
  }

  /**
   * Returns the first letter of the user's name for the avatar circle.
   */
  get avatarLetter(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  /** Toggle the mobile hamburger menu */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Requests full-screen mode using the appropriate browser API.
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen)             { this.element.requestFullscreen(); }
      else if (this.element.mozRequestFullScreen)     { this.element.mozRequestFullScreen(); }
      else if (this.element.webkitRequestFullscreen)  { this.element.webkitRequestFullscreen(); }
      else if (this.element.msRequestFullscreen)      { this.element.msRequestFullscreen(); }
    } else {
      if (this.document.exitFullscreen)               { this.document.exitFullscreen(); }
      else if (this.document.mozCancelFullScreen)     { this.document.mozCancelFullScreen(); }
      else if (this.document.webkitExitFullscreen)    { this.document.webkitExitFullscreen(); }
      else if (this.document.msExitFullscreen)        { this.document.msExitFullscreen(); }
    }
  }

  /**
   * Changes the UI theme (light/dark) and broadcasts the event for other components.
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);
    document.documentElement.setAttribute('data-bs-theme', mode === 'dark' ? 'dark' : 'light');
  }

  /**
   * Sets the active UI language using the language service.
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Handles topbar shadow visibility based on page scroll position.
   */
  windowScroll() {
    const topbar = document.getElementById('page-topbar');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      topbar?.classList.add('topbar-shadow');
    } else {
      topbar?.classList.remove('topbar-shadow');
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /** Clean up subscriptions to prevent memory leaks */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

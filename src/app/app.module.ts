import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

// Environment config (used for NgRx DevTools production flag)
import { environment } from '../environments/environment';

// HTTP Interceptors
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Core Services (provided globally to all modules)
import { LanguageService } from './core/services/language.service';
import { EventService } from './core/services/event.service';

// State Management (NgRx)
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authenticationReducer } from './store/Authentication/authentication.reducer';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { EcommerceEffects } from './store/Ecommerce/ecommerce_effect';
import { rootReducer } from './store';

// UI Modules
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// Feature Modules
import { AuthModule } from './components/auth/auth.module';
import { LayoutsModule } from './components/layouts.module';

/**
 * Factory function required by TranslateModule to load translation JSON files.
 * Files are loaded from `assets/i18n/<lang>.json` (e.g. fr.json, en.json).
 */
export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    // Components that belong directly to this root module
    declarations: [
        AppComponent
    ],

    // Modules this application module depends on
    imports: [
        AuthModule,           // Authentication pages (signin, signup, etc.)
        LayoutsModule,        // Shared layout components (topbar, footer)
        BrowserModule,        // Core browser rendering support
        BrowserAnimationsModule, // Required for Angular animations
        AppRoutingModule,     // Root-level routing configuration
        RouterModule,         // Angular router (required for routerLink etc.)
        NgbDropdownModule,    // Bootstrap dropdown support (used in topbar)
        FormsModule,          // Template-driven forms

        // Internationalization (i18n) — loads JSON translation files
        TranslateModule.forRoot({
            defaultLanguage: 'fr', // Default UI language is French
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),

        // NgRx: Global state store
        StoreModule.forRoot(rootReducer),

        // NgRx DevTools: Enables time-travel debugging in the browser extension
        StoreDevtoolsModule.instrument({
            maxAge: 25,                          // Keep the last 25 state snapshots
            logOnly: environment.production,     // Disable devtools interactivity in production
        }),

        // NgRx Effects: Handles async side-effects like Firebase API calls
        EffectsModule.forRoot([AuthenticationEffects, EcommerceEffects]),
    ],

    // Global providers: services and interceptors available throughout the app
    providers: [
        // Attaches the Firebase ID token to every outgoing HTTP request (Authorization header)
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

        // Intercepts HTTP error responses globally and handles them consistently
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // Provides the modern HttpClient with support for class-based interceptors
        provideHttpClient(withInterceptorsFromDi()),

        // Global singleton services
        LanguageService, // Manages UI language switching
        EventService,    // Global event bus for component-to-component communication
    ],

    // The root component that Angular bootstraps into index.html's <app-root>
    bootstrap: [AppComponent]
})
export class AppModule { }

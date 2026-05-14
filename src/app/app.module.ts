import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Environment config (used for NgRx DevTools production flag)
import { environment } from '../environments/environment';

// HTTP Interceptors
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Pipes

// Core Services (provided globally to all modules)
import { EventService } from './core/services/event.service';

// State Management (NgRx)
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';

// UI Modules
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// Feature Modules
import { AuthModule } from './components/auth/auth.module';
import { LayoutsModule } from './components/layouts.module';

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

        // NgRx: Global state store
        StoreModule.forRoot(rootReducer),

        // NgRx DevTools: Enables time-travel debugging in the browser extension
        StoreDevtoolsModule.instrument({
            maxAge: 25,                          // Keep the last 25 state snapshots
            logOnly: environment.production,     // Disable devtools interactivity in production
        }),

        // NgRx Effects: Handles async side-effects like Firebase API calls
        EffectsModule.forRoot([AuthenticationEffects]),
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
        EventService,    // Global event bus for component-to-component communication
    ],

    // The root component that Angular bootstraps into index.html's <app-root>
    bootstrap: [AppComponent]
})
export class AppModule { }

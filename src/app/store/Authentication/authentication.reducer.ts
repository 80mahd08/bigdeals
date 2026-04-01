import { createReducer, on } from '@ngrx/store';
import {
  Register, RegisterFailure, RegisterSuccess,
  login, loginFailure, loginSuccess,
  logout, logoutSuccess
} from './authentication.actions';
import { User } from './auth.models';

/**
 * AuthenticationState
 *
 * Defines the shape of the authentication slice of the NgRx global store.
 */
export interface AuthenticationState {
  // Whether the user is currently authenticated
  isLoggedIn: boolean;
  // The currently authenticated user (null if logged out)
  user: User | null;
  // Any error message from a failed auth operation
  error: string | null;
  // Whether an auth operation (login/register) is in progress
  loading: boolean;
}

/**
 * Initial state: no user is logged in, no errors, not loading.
 */
const initialState: AuthenticationState = {
  isLoggedIn: false,
  user: null,
  error: null,
  loading: false,
};

/**
 * authenticationReducer
 *
 * Pure function that handles state transitions based on dispatched actions.
 * Each `on()` block specifies an action and returns the new state.
 */
export const authenticationReducer = createReducer(
  initialState,

  // --- Registration ---
  // When registration starts, set loading and clear any previous errors
  on(Register, (state) => ({ ...state, loading: true, error: null })),
  // Registration succeeded: user is logged in
  on(RegisterSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, loading: false })),
  // Registration failed: store the error message
  on(RegisterFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // --- Login ---
  // When login starts, set loading and clear any previous errors
  on(login, (state) => ({ ...state, loading: true, error: null })),
  // Login succeeded: user is now authenticated
  on(loginSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, loading: false })),
  // Login failed: store the error message
  on(loginFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // --- Logout ---
  // Logout dispatched: immediately clear the user from state
  on(logout, (state) => ({ ...state, isLoggedIn: false, user: null, loading: true })),
  // Logout succeeded: clean up loading flag
  on(logoutSuccess, (state) => ({ ...state, isLoggedIn: false, user: null, loading: false })),
);

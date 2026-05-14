import { ActionReducerMap } from '@ngrx/store';
import { authenticationReducer, AuthenticationState } from './Authentication/authentication.reducer';

export interface RootReducerState {
  authentication: AuthenticationState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  authentication: authenticationReducer
};

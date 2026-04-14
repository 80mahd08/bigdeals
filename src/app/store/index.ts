import { ActionReducerMap } from '@ngrx/store';
import { authenticationReducer, AuthenticationState } from './Authentication/authentication.reducer';
import { ecommercerReducer, EcommerceState } from './Ecommerce/ecommerce_reducer';

export interface RootReducerState {
  authentication: AuthenticationState;
  ecommerce: EcommerceState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  authentication: authenticationReducer,
  ecommerce: ecommercerReducer
};

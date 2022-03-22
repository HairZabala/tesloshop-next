import { UiState } from './';

type UiActionType =
    | { type: '[UI] - toggle' }
  
export const uiReducer = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case '[UI] - toggle':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    default:
      return state;
  }
};
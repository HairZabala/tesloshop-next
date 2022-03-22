import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
  isMenuOpen: boolean;
}

const initialState: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC = ({ children }: any) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSideMenu = () => {
    dispatch({
      type: '[UI] - toggle'
    })
  }

  return (
    <UiContext.Provider
      value={{
        ...state,
        toggleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
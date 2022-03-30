import { FC, useReducer, useEffect } from 'react';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined
};

export const AuthProvider: FC = ({ children }: any) => {

  const router = useRouter();

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if(Cookies.get('token')){
      checkToken();
    }
  }, [])
  
  const checkToken = async () => {
    try {
      
      const { data } = await tesloApi.get('/user/validate-jwt');
      const { token, user }= data;

      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });

    } catch (error) {
      Cookies.remove('token')
    }
  }

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      
      const { data } = await tesloApi.post('/user/login', { email,  password });
      const { token, user }= data;

      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });

      return true;

    } catch (error) {
      return false;
    }
  }

  const registerUser = async (email: string, name: string, password: string): Promise<{hasError: boolean; message?: string; }> => {
    
    try {
      const { data } = await tesloApi.post('/user/register', { email, name, password });
      const { token, user }= data;

      Cookies.set('token', token);
      dispatch({
        type: '[Auth] - Login',
        payload: user
      });

      return {
        hasError: false,
      }

    } catch (error) {
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'No se puedo crear el usuario. - Intente de nuevo.'
      }
    }
  }

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('cart');
    router.reload();
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
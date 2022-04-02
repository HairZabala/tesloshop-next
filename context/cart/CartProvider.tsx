import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import tesloApi from '../../api/tesloApi';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const initialState: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider: FC = ({ children }: any) => {
  
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const cart = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cart })
      
    } catch (error) {
      dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
    }
  }, []);

  useEffect(() => {
      if(!Cookie.get('firstName')) return;

      const address = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      }
      dispatch({ type: '[Cart] - Load address from cookies', payload: address })
  }, []);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);
  
  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev,0);
    const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev,0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * ( taxRate + 1)
    }

    dispatch({
      type: '[Cart] - update orden summary',
      payload: orderSummary
    })
  }, [state.cart]);
  
  const addProductToCart = (product: ICartProduct) => {

    let productInCart = state.cart.find((productCart) => (productCart._id === product._id && productCart.size === product.size));
    
    if(!productInCart){
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product ]
      })
    }
    
    const updateProducts = state.cart.map((productCart) => {
      if(productCart._id === product._id && productCart.size === product.size){
        return {
          ...productCart,
          quantity: productCart.quantity +  product.quantity
        }
      }else {
        return productCart
      }
    });

    dispatch({
      type: '[Cart] - Update products in cart',
      payload: updateProducts
    })
  }

  const updateQuantityCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Change cart product quantity',
      payload: product
    })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove cart product',
      payload: product
    })
  }

  const updateShippingAddress = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({
      type: '[Cart] - Update address',
      payload: address,
    })
  }

  const createOrder = async(): Promise<{ hasError: boolean, message: string }> => {
    
    if(!state.shippingAddress){
      throw new Error('No hay dirección de entrega.');
    }

    const body: IOrder = {
      orderItems: state.cart.map(p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    }

    try {
      
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({
        type: '[Cart] - Order complete'
      });

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      console.log(error);
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }
      
      return {
        hasError: true,
        message: 'Error no controlado, hable con el administrador'
      }
    }

  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateQuantityCartProduct,
        removeCartProduct,
        updateShippingAddress,

        //orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
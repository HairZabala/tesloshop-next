import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
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

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateQuantityCartProduct,
        removeCartProduct,
        updateShippingAddress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
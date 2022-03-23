import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const initialState: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
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

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateQuantityCartProduct,
        removeCartProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
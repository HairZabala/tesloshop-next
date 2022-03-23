import { CartState } from './';
import { ICartProduct } from '../../interfaces/cart';

type CartActionType =
    | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Change cart product quantity', payload: ICartProduct }
    | { type: '[Cart] - Remove cart product', payload: ICartProduct }
    | { 
      type: '[Cart] - update orden summary', 
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      }
    }
  
export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        cart: action.payload
      };
    case '[Cart] - Update products in cart':
      return {
        
        ...state,
        cart: action.payload
      };
    case '[Cart] - Change cart product quantity':
      return {
        
        ...state,
        cart: state.cart.map((product) => {
          if(product._id === action.payload._id && product.size === action.payload.size){
            return action.payload;
          }else {
            return product;
          }
        })
      };
    case '[Cart] - Remove cart product':
      return {
        
        ...state,
        cart: state.cart.filter((product)=> (!(product._id === action.payload._id && product.size === action.payload.size)))
      };
    case '[Cart] - update orden summary':
      return {
        
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
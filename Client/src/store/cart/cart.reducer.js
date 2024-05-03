import { ADD_TO_CART, REMOVE_FROM_CART } from './cart.types';

const saveCartCounterToLocalStorage = (cartCounter) => {
  localStorage.setItem('cartCounter', JSON.stringify(cartCounter));
};

const loadCartCounterFromLocalStorage = () => {
  const savedCartCounter = localStorage.getItem('cartCounter');
  return savedCartCounter ? JSON.parse(savedCartCounter) : 0;
};

const initialState = {
  cartItems: [],
  cartCounter: loadCartCounterFromLocalStorage(),
  isCartOpen: false,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      saveCartCounterToLocalStorage(state.cartCounter + 1);
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
        cartCounter: state.cartCounter + 1,
      };
    case REMOVE_FROM_CART:
      saveCartCounterToLocalStorage(state.cartCounter - 1);
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
        cartCounter: state.cartCounter - 1,
      };
    default:
      return state;
  }
};

export default cartReducer;

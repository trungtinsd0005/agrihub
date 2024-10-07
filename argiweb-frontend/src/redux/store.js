import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slides/cartSlide'

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
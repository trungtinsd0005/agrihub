import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }
    },

    updateQuantity(state, action) {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
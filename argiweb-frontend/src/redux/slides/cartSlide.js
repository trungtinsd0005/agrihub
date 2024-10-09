import { createSlice } from '@reduxjs/toolkit';

const userId = localStorage.getItem('userId');
const initialCartState = {
    items: userId ? JSON.parse(localStorage.getItem(`cart_${userId}`)) || [] : [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        initializeCart(state, action) {
            console.log('Initializing cart with:', action.payload);
            state.items = Array.isArray(action.payload) ? action.payload : [];
            const userId = localStorage.getItem('userId');
            if(userId) {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
            }
        },

        addToCart(state, action) {
            const item = action.payload;
            const existingItem = state.items.find((i) => i.id === item.id);
            if (existingItem) {
                const newQuantity = existingItem.quantity + (item.quantity || 1);
                if (newQuantity <= existingItem.countInStock) {
                    existingItem.quantity = newQuantity;
                } else {
                    existingItem.quantity = existingItem.countInStock;
                }
            } else {
                state.items.push({ ...item, quantity: item.quantity <= item.countInStock ? item.quantity : 1 });
            }
            const userId = localStorage.getItem('userId');
            if(userId) {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
            }
        },

        updateQuantity(state, action) {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                if (action.payload.quantity <= existingItem.countInStock) {
                    existingItem.quantity = action.payload.quantity;
                } else {
                    existingItem.quantity = existingItem.countInStock;
                }
            }
            const userId = localStorage.getItem('userId');
            if(userId) {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
            }
        },

        removeFromCart: (state, action) => {
            const id = action.payload.id;
            state.items = state.items.filter((item) => item.id !== id);
            const userId = localStorage.getItem('userId');
            if(userId) {
                localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
            }
        },

        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, initializeCart } = cartSlice.actions;

export default cartSlice.reducer;
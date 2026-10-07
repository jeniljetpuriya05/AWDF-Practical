import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialProducts } from '../data/products';

const ShopContext = createContext();

const initialState = {
  products: initialProducts,
  cart: JSON.parse(localStorage.getItem('apex_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('apex_wishlist') || '[]'),
  orders: JSON.parse(localStorage.getItem('apex_orders') || '[]'),
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'featured',
  priceRange: 600,
  minRating: 0,
  promoCode: '',
  discountPercent: 0,
  notification: null
};

function shopReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.payload.id);
      let updatedCart;
      if (existing) {
        updatedCart = state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        cart: updatedCart,
        notification: { message: `Added "${action.payload.name}" to your cart!`, type: 'success' }
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cart.filter(item => item.id !== action.payload);
      return {
        ...state,
        cart: updatedCart,
        notification: { message: 'Item removed from cart', type: 'info' }
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== id)
        };
      }
      return {
        ...state,
        cart: state.cart.map(item => (item.id === id ? { ...item, quantity } : item))
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some(item => item.id === action.payload.id);
      const updatedWishlist = exists
        ? state.wishlist.filter(item => item.id !== action.payload.id)
        : [...state.wishlist, action.payload];
      return {
        ...state,
        wishlist: updatedWishlist,
        notification: {
          message: exists ? 'Removed from favorites' : 'Added to favorites!',
          type: 'success'
        }
      };
    }

    case 'APPLY_PROMO': {
      const code = action.payload.toUpperCase().trim();
      if (code === 'SAVE20') {
        return {
          ...state,
          promoCode: 'SAVE20',
          discountPercent: 20,
          notification: { message: 'Coupon SAVE20 applied! 20% discount granted.', type: 'success' }
        };
      } else if (code === 'WELCOME10') {
        return {
          ...state,
          promoCode: 'WELCOME10',
          discountPercent: 10,
          notification: { message: 'Coupon WELCOME10 applied! 10% discount granted.', type: 'success' }
        };
      } else {
        return {
          ...state,
          notification: { message: 'Invalid promo code. Try SAVE20 or WELCOME10.', type: 'error' }
        };
      }
    }

    case 'PLACE_ORDER': {
      const newOrder = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...state.cart],
        subtotal: action.payload.subtotal,
        discount: action.payload.discount,
        tax: action.payload.tax,
        total: action.payload.total,
        shippingAddress: action.payload.shippingAddress,
        status: 'Processing'
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        cart: [],
        promoCode: '',
        discountPercent: 0,
        notification: { message: `Order #${newOrder.id} placed successfully!`, type: 'success' }
      };
    }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'SET_SORT':
      return { ...state, sortBy: action.payload };

    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };

    case 'SET_MIN_RATING':
      return { ...state, minRating: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    default:
      return state;
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem('apex_wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  useEffect(() => {
    localStorage.setItem('apex_orders', JSON.stringify(state.orders));
  }, [state.orders]);

  // Auto-dismiss notification after 3.5 seconds
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  return (
    <ShopContext.Provider value={{ state, dispatch }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

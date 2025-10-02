import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductUnit } from '@prisma/client';

// Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  unit: ProductUnit;
  quantity: number;
  maxQuantity: number;
  minQuantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
  shopId?: string;
  shopName?: string;
  isOrganic: boolean;
  expiryDate?: Date;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isOpen: boolean; // For cart sidebar/modal
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
  isOpen: false,
};

// Helper functions
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Async thunks
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (
    item: {
      productId: string;
      quantity: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add item to cart');
      }

      const data = await response.json();
      return data.cartItem;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async (
    params: {
      productId: string;
      quantity: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update cart item');
      }

      const data = await response.json();
      return data.cartItem;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to remove item from cart');
      }

      return productId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to clear cart');
      }

      return true;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cart');

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch cart');
      }

      const data = await response.json();
      return data.cartItems;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        if (newQuantity <= existingItem.maxQuantity) {
          existingItem.quantity = newQuantity;
        } else {
          existingItem.quantity = existingItem.maxQuantity;
        }
      } else {
        state.items.push(action.payload);
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.lastUpdated = new Date();
    },
    
    updateCartItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      if (item) {
        const newQuantity = Math.max(
          item.minQuantity,
          Math.min(action.payload.quantity, item.maxQuantity)
        );
        item.quantity = newQuantity;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.lastUpdated = new Date();
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.lastUpdated = new Date();
    },
    
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload);
      if (item && item.quantity < item.maxQuantity) {
        item.quantity += 1;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      }
    },
    
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.productId === action.payload);
      if (item && item.quantity > item.minQuantity) {
        item.quantity -= 1;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      }
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Add to cart async
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingItem = state.items.find(item => item.productId === action.payload.productId);
        
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update cart item async
    builder
      .addCase(updateCartItemAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const item = state.items.find(item => item.productId === action.payload.productId);
        if (item) {
          item.quantity = action.payload.quantity;
          
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
          state.lastUpdated = new Date();
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from cart async
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.productId !== action.payload);
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Clear cart async
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.lastUpdated = new Date();
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch cart async
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.lastUpdated = new Date();
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  toggleCart,
  openCart,
  closeCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
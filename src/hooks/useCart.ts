import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  toggleCart,
  openCart,
  closeCart,
  fetchCartAsync,
} from '@/store/slices/cartSlice';
import type { CartItem } from '@/store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    isOpen,
  } = useAppSelector((state) => state.cart);

  // Fetch cart on mount for authenticated users
  useEffect(() => {
    dispatch(fetchCartAsync());
  }, [dispatch]);

  const addItem = (item: CartItem) => {
    dispatch(addToCart(item));
  };

  const removeItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const updateItem = (productId: string, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const increaseItemQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const decreaseItemQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const toggleCartModal = () => {
    dispatch(toggleCart());
  };

  const openCartModal = () => {
    dispatch(openCart());
  };

  const closeCartModal = () => {
    dispatch(closeCart());
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  const isItemInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  const getCartItemById = (productId: string): CartItem | undefined => {
    return items.find((item) => item.productId === productId);
  };

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    isOpen,
    addItem,
    removeItem,
    updateItem,
    clearCartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    toggleCartModal,
    openCartModal,
    closeCartModal,
    getItemQuantity,
    isItemInCart,
    getCartItemById,
  };
};
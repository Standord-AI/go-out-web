"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  giftTotal?: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (id: string) => CartItem | undefined;
  isInCart: (experienceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateCartTotals = (items: CartItem[]): Omit<CartState, "items"> => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const giftTotal = items.reduce(
    (sum, item) => sum + (item.redeemedBookingId ? item.oldPrice ?? 0 : 0),
    0
  );
  const taxes = (subtotal - giftTotal) * 0.08; // 8% tax rate
  const fees = (subtotal - giftTotal) * 0.05; // 5% service fee
  const total = subtotal - giftTotal + taxes + fees;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    totalItems,
    subtotal,
    giftTotal,
    taxes,
    fees,
    total,
    currency: "USD",
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };

        return {
          ...state,
          items: updatedItems,
          ...calculateCartTotals(updatedItems),
        };
      } else {
        // Add new item
        const updatedItems = [...state.items, action.payload];
        return {
          ...state,
          items: updatedItems,
          ...calculateCartTotals(updatedItems),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems),
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        taxes: 0,
        fees: 0,
        total: 0,
        currency: "USD",
      };
    }

    case "LOAD_CART": {
      return action.payload;
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  taxes: 0,
  fees: 0,
  total: 0,
  currency: "USD",
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        type PersistedCartItem = Omit<CartItem, "date"> & {
          date?: string;
        };
        type PersistedCartState = Omit<CartState, "items"> & {
          items: PersistedCartItem[];
        };

        const parsedCart = JSON.parse(savedCart) as PersistedCartState;
        // Convert date strings back to Date objects
        const itemsWithDates: CartItem[] = parsedCart.items.map((item) => ({
          ...item,
          date: item.date ? new Date(item.date) : undefined,
        }));
        dispatch({
          type: "LOAD_CART",
          payload: { ...parsedCart, items: itemsWithDates },
        });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getCartItem = (id: string) => {
    return state.items.find((item) => item.id === id);
  };

  const isInCart = (experienceId: string) => {
    return state.items.some((item) => item.experienceId === experienceId);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

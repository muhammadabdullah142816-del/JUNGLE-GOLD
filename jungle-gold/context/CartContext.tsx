"use client";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { CartItem } from "@/types/database";

type State = { items: CartItem[] };
type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string; size: string }
  | { type: "QTY"; id: string; size: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "SET_CART"; items: CartItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find(
        (i) => i.id === action.item.id && i.size === action.item.size
      );
      const items = exists
        ? state.items.map((i) =>
            i.id === action.item.id && i.size === action.item.size
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          )
        : [...state.items, action.item];
      return { items };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => !(i.id === action.id && i.size === action.size)) };
    case "QTY":
      return {
        items: state.items.map((i) =>
          i.id === action.id && i.size === action.size ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    case "SET_CART":
      return { items: action.items };
    default:
      return state;
  }
}

const CartCtx = createContext<{
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [mounted, setMounted] = useState(false);

  // Load initial cart from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("jg-cart") || "null");
      if (stored && stored.items) {
        dispatch({ type: "SET_CART", items: stored.items });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("jg-cart", JSON.stringify(state));
    }
  }, [state, mounted]);

  // Don't render until mounted to ensure hydration matches
  if (!mounted) {
    return <CartCtx.Provider value={{ items: [], add: () => {}, remove: () => {}, setQty: () => {}, clear: () => {}, total: 0, count: 0, drawerOpen: false, openDrawer: () => {}, closeDrawer: () => {} }}>{children}</CartCtx.Provider>;
  }

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartCtx.Provider
      value={{
        items: state.items,
        add: (item) => dispatch({ type: "ADD", item }),
        remove: (id, size) => dispatch({ type: "REMOVE", id, size }),
        setQty: (id, size, quantity) => dispatch({ type: "QTY", id, size, quantity }),
        clear: () => dispatch({ type: "CLEAR" }),
        total,
        count,
        drawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

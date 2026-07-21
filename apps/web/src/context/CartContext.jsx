import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const refresh = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try { setCart(await api("/cart")); } catch { setCart({ items: [] }); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (productId, qty = 1, variantId) => {
    const c = await api("/cart/add", { method: "POST", body: { productId, qty, variantId } });
    setCart(c);
  };
  const updateQty = async (itemId, qty) => setCart(await api(`/cart/item/${itemId}`, { method: "PUT", body: { qty } }));
  const remove = async (itemId) => setCart(await api(`/cart/item/${itemId}`, { method: "DELETE" }));
  const clear = async () => { await api("/cart", { method: "DELETE" }); setCart({ items: [] }); };

  return <CartCtx.Provider value={{ cart, refresh, add, updateQty, remove, clear }}>{children}</CartCtx.Provider>;
}

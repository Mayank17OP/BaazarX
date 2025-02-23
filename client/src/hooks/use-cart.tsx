import { createContext, ReactNode, useContext, useState } from "react";
import { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  isOpen: boolean;
  toggleCart: () => void;
  items: CartItem[];
  cartItemCount: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, Number(product.stock)) }
            : item
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, Number(item.product.stock)) }
          : item
      )
    );
  };

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        toggleCart,
        items,
        cartItemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
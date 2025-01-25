import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
}

// Define the shape of the cart context
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
}

// Create the CartContext
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Cart Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // If product exists, update its quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      // Add new product
      return [...prevCart, product];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update product quantity in the cart
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price of the cart
  const calculateTotal = () =>
    cart.reduce(
      (acc, item) => acc + (item.discountedPrice || item.price) * item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
import { apiError } from '@/utils/pricing';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Server cart, flattened for the UI. Prices and stock come from the live product,
// which is what the server charges at checkout.
const formatCart = (data) =>
  (data.items || []).map((item) => ({
    _id: item._id, // Cart item id, used for update/remove calls
    productId: item.product._id,
    name: item.product.name || item.name,
    price: item.product.price ?? item.price,
    stock: item.product.stock,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl || item.image,
    image: item.product.imageUrl || item.image,
  }));

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);
  const axios = useAxios();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/cart');
      setItems(formatCart(data));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Load whenever the logged-in user changes
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    axios
      .get('/cart')
      .then(({ data }) => {
        if (!cancelled) setItems(formatCart(data));
      })
      .catch((error) => console.error('Error fetching cart:', error));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Nothing is shown for signed-out visitors
  const cartItems = user ? items : [];
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Resolves true on success so callers can confirm
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return false;
    }
    try {
      await axios.post('/cart', { productId: product._id, quantity });
      await fetchCart();
      return true;
    } catch (error) {
      toast.error(apiError(error, 'Could not add this item. Please try again.'));
      return false;
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    try {
      await axios.put(`/cart/${cartItemId}`, { quantity: newQty });
      await fetchCart();
    } catch (error) {
      toast.error(apiError(error, 'Could not update the quantity'));
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/cart/${cartItemId}`);
      await fetchCart();
      return true;
    } catch (error) {
      toast.error(apiError(error, 'Could not remove the item'));
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/cart');
      setItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart, // The assistant refreshes the cart after it changes it
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

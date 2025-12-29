'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useContext(AuthContext);
  const axios = useAxios();

  // 1. FETCH CART FROM DB (This connects Frontend to AI)
  const fetchCart = async () => {
    if (!user) {
        setCartItems([]);
        return;
    }
    try {
      const { data } = await axios.get('/cart');
      // Backend returns the cart object, items is inside it
      // Note: Data structure depends on controller. 
      // If controller returns { items: [...] }, use data.items.
      // If controller returns full mongoose object, use data.items.
      
      const items = data.items || [];
      
      // Transform backend data to frontend format if needed
      // (Our backend populates 'product', so we flatten it for easy UI use)
      const formattedItems = items.map(item => ({
          _id: item.product._id, // Keep Product ID as the main ID for UI
          name: item.name,
          price: item.price,
          image: item.image || item.product.imageUrl,
          quantity: item.quantity,
          imageUrl: item.image || item.product.imageUrl // Handle both naming conventions
      }));

      setCartItems(formattedItems);
      
      // Calculate Total
      const t = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(t);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // 2. Initial Load
  useEffect(() => {
    fetchCart();
  }, [user]); // Runs whenever user logs in

  // 3. Add to Cart (Syncs with DB)
  const addToCart = async (product) => {
    try {
        await axios.post('/cart', { 
            productId: product._id, 
            quantity: 1 
        });
        fetchCart(); // Refresh data
        // Optional: toast.success('Added to cart');
    } catch (error) {
        console.error(error);
        alert('Please login to add items');
    }
  };

  // 4. Update Quantity (Syncs with DB)
  const updateQuantity = async (productId, newQty) => {
    try {
        await axios.put(`/cart/${productId}`, { quantity: newQty });
        fetchCart(); // Refresh UI immediately
    } catch (error) {
        console.error(error);
    }
  };

  // 5. Remove Item (Syncs with DB)
  const removeFromCart = async (productId) => {
    try {
        await axios.delete(`/cart/${productId}`);
        fetchCart();
    } catch (error) {
        console.error(error);
    }
  };

  // 6. Clear Cart
  const clearCart = async () => {
      try {
          await axios.delete('/cart');
          setCartItems([]);
          setTotal(0);
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        total, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        fetchCart // Exported so ChatBot can call it!
    }}>
      {children}
    </CartContext.Provider>
  );
};
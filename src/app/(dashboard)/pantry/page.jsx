'use client';
import Navbar from '@/components/common/Navbar';
import PantryList from '@/components/pantry/PantryList';
import ExpiryAlert from '@/components/pantry/ExpiryAlert';
import { useState, useEffect } from 'react';
import { calculateExpiry } from '@/utils/calculateExpiry';
import useAxios from '@/hooks/useAxios';

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
      const fetchPantry = async () => {
          try {
              const { data } = await axios.get('/pantry');
              setItems(data);
              setLoading(false);
          } catch (error) {
              console.error("Error fetching pantry", error);
              setLoading(false);
          }
      };
      if (localStorage.getItem('token')) {
          fetchPantry();
      }
  }, []);
  
  const expiringCount = items.filter(item => {
      const { daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
      return daysLeft <= 3 && daysLeft >= 0;
  }).length;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Digital Pantry</h1>
        
        <ExpiryAlert count={expiringCount} />
        
        {items.length === 0 ? (
            <p>Your pantry is empty. Go buy some groceries!</p>
        ) : (
            // Map _id to id for the component
            <PantryList items={items.map(i => ({...i, id: i._id}))} />
        )}
      </div>
    </div>
  );
}
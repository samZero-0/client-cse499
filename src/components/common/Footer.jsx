import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 mb-2">
          Made with <FaHeart className="text-red-500" /> for a sustainable future.
        </p>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} PantryPal. Reducing waste, one pantry at a time.
        </p>
      </div>
    </footer>
  );
}
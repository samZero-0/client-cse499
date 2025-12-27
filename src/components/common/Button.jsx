import { twMerge } from 'tailwind-merge';

export default function Button({ children, className, variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50'
  };

  return (
    <button className={twMerge(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
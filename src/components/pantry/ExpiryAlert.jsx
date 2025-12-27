import { FaExclamationTriangle } from 'react-icons/fa';

export default function ExpiryAlert({ count }) {
  if (count === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg flex items-center gap-3">
      <FaExclamationTriangle className="text-yellow-500 text-xl" />
      <div>
        <p className="text-sm font-bold text-yellow-800">
          Action Needed
        </p>
        <p className="text-sm text-yellow-700">
          You have {count} items expiring within the next 3 days. Use them soon to avoid waste!
        </p>
      </div>
    </div>
  );
}
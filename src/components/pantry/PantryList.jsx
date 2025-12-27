import { calculateExpiry } from '@/utils/calculateExpiry';

export default function PantryList({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const { status, daysLeft } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);
        
        let statusStyles = 'bg-green-100 text-green-800 border-green-200';
        let statusText = `${daysLeft} days left`;

        if (status === 'expired') {
            statusStyles = 'bg-red-100 text-red-800 border-red-200';
            statusText = 'Expired';
        } else if (status === 'expiring_soon') {
            statusStyles = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            statusText = `Expires in ${daysLeft} days`;
        }

        return (
          <div key={item.id} className={`bg-white p-4 rounded-lg border-2 shadow-sm flex justify-between items-center ${statusStyles.split(' ')[2]}`}>
            <div>
              <h4 className="font-bold text-gray-800">{item.name}</h4>
              <p className="text-xs text-gray-500">Bought: {new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles}`}>
              {statusText}
            </span>
          </div>
        );
      })}
    </div>
  );
}
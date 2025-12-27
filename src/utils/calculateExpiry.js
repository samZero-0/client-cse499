import { addDays, differenceInDays } from 'date-fns';

export const calculateExpiry = (purchaseDate, shelfLifeDays) => {
  const expiryDate = addDays(new Date(purchaseDate), shelfLifeDays);
  const daysLeft = differenceInDays(expiryDate, new Date());
  
  let status = 'fresh';
  if (daysLeft < 0) status = 'expired';
  else if (daysLeft <= 3) status = 'expiring_soon';

  return { daysLeft, status, expiryDate };
};
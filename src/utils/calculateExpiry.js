import { addDays, differenceInDays } from 'date-fns';

export const calculateExpiry = (purchaseDate, shelfLifeDays) => {
  const expiryDate = addDays(new Date(purchaseDate), shelfLifeDays);
  const daysLeft = differenceInDays(expiryDate, new Date());

  let status = 'fresh';
  if (daysLeft < 0) status = 'expired';
  else if (daysLeft <= 3) status = 'expiring_soon';

  return { daysLeft, status, expiryDate };
};

const toneClasses = {
  danger: { pill: 'bg-danger/12 text-danger', bar: 'bg-danger', text: 'text-danger' },
  warning: { pill: 'bg-warning/12 text-warning', bar: 'bg-warning', text: 'text-warning' },
  success: { pill: 'bg-success/12 text-success', bar: 'bg-success', text: 'text-success' },
};

// UI-ready expiry details for a pantry item: label, colour tone and freshness percentage
export const getExpiryInfo = (item) => {
  const { daysLeft, status, expiryDate } = calculateExpiry(item.purchaseDate, item.shelfLifeDays);

  let tone = 'success';
  let label = `${daysLeft} days left`;
  if (status === 'expired') {
    tone = 'danger';
    label = 'Expired';
  } else if (status === 'expiring_soon') {
    tone = 'warning';
    label = daysLeft === 0 ? 'Use today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`;
  }

  const percent = item.shelfLifeDays
    ? Math.max(0, Math.min(100, (daysLeft / item.shelfLifeDays) * 100))
    : 0;

  return { daysLeft, status, expiryDate, tone, label, percent, classes: toneClasses[tone] };
};

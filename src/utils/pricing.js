// Display copies of the server's pricing rules (server-cse499/src/utils/pricing.js).
// The server recomputes every total, so these only drive what the UI shows before ordering.

export const DELIVERY_FEE = 60;
export const FREE_DELIVERY_THRESHOLD = 500;
export const SUBSCRIPTION_DISCOUNT = 0.15;

export const deliveryFeeFor = (subtotal) => (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);

// Message from a failed API call, falling back to a generic one
export const apiError = (error, fallback) => error?.response?.data?.message || fallback;

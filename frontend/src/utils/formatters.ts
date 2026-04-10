/**
 * Formats a price in Lakhs to a human-readable Indian currency format.
 * Example: 125.00 -> ₹1.25 Cr, 75.5 -> ₹75.5 L
 */
export const formatIndianCurrency = (priceInLakhs: number | string | null | undefined): string => {
  if (priceInLakhs == null || priceInLakhs === '') return '₹0';
  
  const numPrice = typeof priceInLakhs === 'string' ? parseFloat(priceInLakhs) : priceInLakhs;
  
  if (isNaN(numPrice)) return '₹0';

  if (numPrice >= 100) {
    const rawCrores = numPrice / 100;
    const formatted = rawCrores.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
    return `₹${formatted} Cr`;
  }
  
  const formattedLakhs = numPrice.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return `₹${formattedLakhs} L`;
};

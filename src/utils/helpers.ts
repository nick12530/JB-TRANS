export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getProfitMargin(cost: number, revenue: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}

export function generateTripId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 3);
  return `TRIP-${timestamp}-${random}`.toUpperCase();
}

export function getPickupPointCode(point: 'A' | 'B' | 'C' | 'D'): { min: number; max: number } {
  const codes: Record<string, { min: number; max: number }> = {
    A: { min: 100, max: 300 },
    B: { min: 400, max: 600 },
    C: { min: 700, max: 900 },
    D: { min: 1000, max: 1200 },
  };
  return codes[point];
}

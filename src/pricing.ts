/**
 * Order pricing helpers.
 *
 * All monetary values are rounded to two decimal places (cents).
 */

export interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderOptions {
  /** Percentage discount applied to the subtotal, e.g. 10 for 10% off. */
  discountPercent?: number;
  /** Tax rate applied after the discount, e.g. 0.08 for 8%. */
  taxRate?: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sum of unitPrice * quantity across all items. */
export function subtotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => {
    if (item.quantity < 0) {
      throw new Error(`quantity for "${item.name}" cannot be negative`);
    }
    if (item.unitPrice < 0) {
      throw new Error(`unitPrice for "${item.name}" cannot be negative`);
    }
    return sum + item.unitPrice * item.quantity;
  }, 0);
  return round2(total);
}

/** Apply a percentage discount to an amount. */
export function applyDiscount(amount: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('discountPercent must be between 0 and 100');
  }
  return round2(amount * (1 - discountPercent / 100));
}

/** Compute tax owed on an amount at the given rate. */
export function taxFor(amount: number, taxRate: number): number {
  if (taxRate < 0) {
    throw new Error('taxRate cannot be negative');
  }
  return round2(amount * taxRate);
}

/** Full order total: subtotal, minus discount, plus tax. */
export function orderTotal(items: CartItem[], options: OrderOptions = {}): number {
  const { discountPercent = 0, taxRate = 0 } = options;
  const base = subtotal(items);
  const discounted = applyDiscount(base, discountPercent);
  const tax = taxFor(discounted, taxRate);
  return round2(discounted + tax);
}

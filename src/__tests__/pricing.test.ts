import { subtotal, applyDiscount, taxFor, orderTotal, CartItem } from '../pricing';

const items: CartItem[] = [
  { name: 'widget', unitPrice: 9.99, quantity: 2 },
  { name: 'gadget', unitPrice: 19.5, quantity: 1 },
];

describe('subtotal', () => {
  it('sums unitPrice * quantity across items', () => {
    expect(subtotal(items)).toBe(39.48);
  });

  it('returns 0 for an empty cart', () => {
    expect(subtotal([])).toBe(0);
  });

  it('throws on negative quantity', () => {
    expect(() => subtotal([{ name: 'bad', unitPrice: 1, quantity: -1 }])).toThrow();
  });
});

describe('applyDiscount', () => {
  it('applies a percentage discount', () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  it('is a no-op at 0%', () => {
    expect(applyDiscount(42.5, 0)).toBe(42.5);
  });

  it('rejects out-of-range percentages', () => {
    expect(() => applyDiscount(100, 150)).toThrow();
  });
});

describe('taxFor', () => {
  it('computes tax at the given rate', () => {
    expect(taxFor(100, 0.08)).toBe(8);
  });
});

describe('orderTotal', () => {
  it('combines subtotal, discount, and tax', () => {
    // subtotal 39.48 -> 10% off = 35.53 -> +8% tax = 38.37
    expect(orderTotal(items, { discountPercent: 10, taxRate: 0.08 })).toBe(38.37);
  });

  it('defaults to subtotal with no options', () => {
    expect(orderTotal(items)).toBe(39.48);
  });
});

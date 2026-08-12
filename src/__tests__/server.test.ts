import request from 'supertest';
import { createApp } from '../server';

const app = createApp();

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('POST /orders/total', () => {
  it('computes the order total', async () => {
    const res = await request(app)
      .post('/orders/total')
      .send({
        items: [
          { name: 'widget', unitPrice: 9.99, quantity: 2 },
          { name: 'gadget', unitPrice: 19.5, quantity: 1 },
        ],
        options: { discountPercent: 10, taxRate: 0.08 },
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 38.37 });
  });

  it('rejects an empty cart', async () => {
    const res = await request(app).post('/orders/total').send({ items: [] });
    expect(res.status).toBe(400);
  });
});

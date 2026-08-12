import express, { Request, Response } from 'express';
import { orderTotal, CartItem, OrderOptions } from './pricing';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.post('/orders/total', (req: Request, res: Response) => {
    const items = req.body?.items as CartItem[] | undefined;
    const options = (req.body?.options as OrderOptions) ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    try {
      const total = orderTotal(items, options);
      return res.json({ total });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'invalid request';
      return res.status(400).json({ error: message });
    }
  });

  return app;
}

/* istanbul ignore next */
if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => {
    console.log(`droid-ci-demo listening on http://localhost:${port}`);
  });
}

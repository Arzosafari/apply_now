import { config } from './config';
import { createApp } from './app';

const app = createApp();

const server = app.listen(config.port, '127.0.0.1', () => {
  console.log(`FaraTech API listening on http://127.0.0.1:${config.port}`);
  console.log(`Environment: ${config.isProduction ? 'production' : 'development'}`);
  if (!config.stripe.enabled) console.log('Online payments: not configured (Stripe key missing)');
});

function shutdown(signal: string) {
  console.log(`${signal} received, closing server...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

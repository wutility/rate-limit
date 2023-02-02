import express from 'express';
import { RateLimitBanHandler, rateLimit, RateLimitStore } from '../dist/rateli.mjs';

const app = express();
// Use the middleware to handle rate limiting and banned clients
app.use(rateLimit({ max: 2, windowMs: 10000, maxReputation: 4 }));
app.use(RateLimitBanHandler());

app.get('/', (req, res) => {

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

  res.send('hello ' + ip + ' ' + JSON.stringify(RateLimitStore.findAll()))
})

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

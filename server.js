// server.js - Production Node.js Server for cPanel / VPS / Cloud Hosting
// Matribhumi TV - matribhumitv.com

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app in production mode
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, () => {
    console.log(`> Matribhumi TV Portal is successfully running on http://${hostname}:${port}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});

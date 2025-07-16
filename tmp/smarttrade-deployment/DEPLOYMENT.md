# SmartTrade AI - Deployment Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

## Hosting Platform Instructions

### Vercel
1. Upload the project folder
2. Set environment variables in Vercel dashboard
3. Deploy - it will automatically run `npm run build`

### Netlify
1. Upload the project folder
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Set environment variables in Netlify dashboard

### DigitalOcean App Platform
1. Connect your repository
2. Build command: `npm run build`
3. Run command: `npm start`
4. Set environment variables in the app settings

### Railway
1. Connect your repository
2. Railway will automatically detect Node.js
3. Set environment variables in Railway dashboard

### Heroku
1. Create a new Heroku app
2. Set environment variables using `heroku config:set`
3. Deploy using Git or GitHub integration

## Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t smarttrade-ai .
docker run -p 5000:5000 --env-file .env smarttrade-ai
```

## Environment Variables

All environment variables are documented in `.env.example`. The most important ones are:

- `OPENROUTER_API_KEY` - Required for AI recommendations
- `ALPHA_VANTAGE_API_KEY` - Required for stock data
- `COINGECKO_API_KEY` - Optional, improves rate limits
- `PORT` - Default is 5000

## Database Setup (Optional)

By default, the app uses in-memory storage. For production, you can set up PostgreSQL:

1. Create a PostgreSQL database
2. Set `DATABASE_URL` in your environment variables
3. The app will automatically use the database

## Performance Notes

- The app includes comprehensive caching to handle API rate limits
- Fallback data is provided when APIs are unavailable
- Production build is optimized for performance
- Static files are served efficiently

## Security

- All API keys are stored as environment variables
- CORS is configured appropriately
- Input validation is implemented
- Rate limiting is built-in

## Monitoring

The app logs important events:
- API failures and fallbacks
- Rate limit handling
- Server startup and errors

Monitor these logs for production health.
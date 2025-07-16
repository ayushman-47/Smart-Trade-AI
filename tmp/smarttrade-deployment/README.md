# SmartTrade AI - Deployment Package

This is a complete deployment package for the SmartTrade AI trading application.

## Requirements

- Node.js 18+ or 20+
- npm or yarn
- PostgreSQL database (optional - uses in-memory storage by default)

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Required API Keys
OPENROUTER_API_KEY=your_openrouter_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
COINGECKO_API_KEY=your_coingecko_api_key_here

# Optional Database (uses in-memory storage if not provided)
DATABASE_URL=your_postgresql_connection_string

# Server Configuration
NODE_ENV=production
PORT=5000
```

## API Key Setup

1. **OpenRouter API Key**: Get from https://openrouter.ai/
   - Sign up for an account
   - Generate an API key from your dashboard
   - This is used for AI-powered trading recommendations

2. **Alpha Vantage API Key**: Get from https://www.alphavantage.co/support/#api-key
   - Free tier available
   - Used for stock market data

3. **CoinGecko API Key**: Get from https://www.coingecko.com/en/api/pricing
   - Optional but recommended for higher rate limits
   - Used for cryptocurrency market data

## Installation

1. Extract the zip file
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file with the required API keys

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the application:
   ```bash
   npm start
   ```

## Development Mode

For development, you can run:
```bash
npm run dev
```

## Features

- Real-time cryptocurrency and stock market data
- AI-powered trading recommendations
- Market sentiment analysis
- Risk assessment and scoring
- Responsive web interface

## Deployment

The application is configured to run on any hosting platform that supports Node.js. It includes:

- Express.js backend server
- React frontend with Vite
- Built-in fallback data for API rate limits
- Comprehensive error handling

## API Endpoints

- `GET /api/market-overview` - Get market sentiment and statistics
- `POST /api/analyze` - Generate trading recommendations

## Troubleshooting

- If APIs are rate-limited, the app will automatically use fallback data
- Check console logs for any API authentication issues
- Ensure all required environment variables are set
- The app works without a database using in-memory storage

## Support

This application was built with modern web technologies and includes comprehensive error handling and fallback systems for production use.
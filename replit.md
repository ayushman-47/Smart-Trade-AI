# SmartTrade AI - Replit Project Documentation

## Overview

SmartTrade AI is a real-time AI-powered trading application that provides intelligent cryptocurrency and stock trading recommendations. The app leverages real-time market data, AI analysis, and sophisticated scoring algorithms to deliver actionable trading insights with target prices, stop losses, risk assessments, and projected returns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom trading-themed design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### AI Integration
- **AI Provider**: OpenRouter (supporting OpenAI GPT-4o and other models)
- **Market Data Sources**: 
  - CoinGecko API for cryptocurrency data
  - Alpha Vantage API for stock market data
- **Analysis Engine**: Custom market analyzer combining real-time data with AI reasoning

## Key Components

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Trade Recommendations Table**: Stores generated trading recommendations with comprehensive metadata including scores, risk levels, and explanations
- **Validation**: Zod schemas for type-safe data validation

### Market Data Services
- **CoinGeckoClient**: Fetches top cryptocurrency data including prices, market caps, and percentage changes
- **AlphaVantageClient**: Retrieves stock market data for major equities with rate limiting
- **OpenRouterClient**: Handles AI-powered analysis and recommendation generation

### Frontend Components
- **ControlPanel**: Main input interface for trading queries with timeframe and risk level selection
- **MarketOverview**: Dashboard showing market sentiment and trading statistics
- **TradeCard**: Individual recommendation display with visual indicators and detailed metrics
- **UI Library**: Comprehensive set of reusable components based on Radix UI

## Data Flow

1. **User Input**: User submits trading query through ControlPanel with selected timeframe and risk preferences
2. **Market Data Fetching**: Backend services fetch real-time data from CoinGecko and Alpha Vantage APIs
3. **AI Analysis**: Market data is processed by OpenRouter AI service to generate intelligent recommendations
4. **Scoring Algorithm**: Custom algorithm calculates recommendation scores based on profit potential, security, and trend analysis
5. **Response Processing**: Results are filtered and formatted to return top 4 crypto and stock recommendations
6. **UI Update**: Frontend displays recommendations through TradeCard components with real-time updates

## External Dependencies

### APIs and Services
- **OpenRouter**: AI model access for GPT-4o and other language models
- **CoinGecko**: Cryptocurrency market data and pricing information
- **Alpha Vantage**: Stock market data and financial information
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESLint/Prettier**: Code quality and formatting (implied by project structure)

## Deployment Strategy

The application is configured for deployment on Replit with the following considerations:

### Build Process
- **Frontend**: Vite builds the React application to `dist/public`
- **Backend**: esbuild bundles the Express server to `dist/index.js`
- **Database**: Drizzle handles schema migrations and database setup

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with hot reloading
- **Production**: Compiled JavaScript execution with static file serving
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### API Keys Required
- `OPENROUTER_API_KEY` or `OPENAI_API_KEY` for AI services
- `ALPHA_VANTAGE_API_KEY` for stock data
- `COINGECKO_API_KEY` (optional, for higher rate limits)

### Performance Considerations
- Rate limiting implemented for external API calls
- Caching strategy through TanStack Query
- Optimized bundle splitting with Vite
- Serverless database connection pooling with Neon

The application is designed to be easily deployable on Replit's platform while maintaining scalability and performance through modern web development practices.
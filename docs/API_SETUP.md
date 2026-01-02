# API Setup Guide

This guide will help you obtain API keys for financial data providers.

## TwelveData API (Stocks & Indices)

TwelveData provides comprehensive stock market data with a generous free tier.

### Free Tier Limits:
- 800 API requests per day
- Real-time and historical data
- Stocks, ETFs, Indices, Forex, Cryptocurrencies

### Setup Steps:

1. Go to [TwelveData](https://twelvedata.com/)
2. Click **"Get Free API Key"**
3. Sign up with your email
4. Verify your email address
5. Go to your [Dashboard](https://twelvedata.com/account/api-keys)
6. Copy your API key
7. Add it to your `.env` file:
   ```env
   TWELVEDATA_API_KEY=your_api_key_here
   ```

### Supported Symbols:
- US Stocks: AAPL, GOOGL, MSFT, TSLA, etc.
- Indices: SPX, DJI, IXIC, etc.
- ETFs: SPY, QQQ, VOO, etc.

### API Documentation:
- [TwelveData API Docs](https://twelvedata.com/docs)

---

## CoinGecko API (Cryptocurrencies)

CoinGecko provides free cryptocurrency market data.

### Free Tier Limits:
- 10-50 calls/minute (no daily limit)
- Real-time prices
- Historical data
- Market charts

### Setup Steps:

1. Go to [CoinGecko](https://www.coingecko.com/en/api)
2. **No API key required for free tier!**
3. (Optional) Sign up for higher rate limits
4. If you have an API key, add it to `.env`:
   ```env
   COINGECKO_API_KEY=your_api_key_here
   ```

### Supported Coins:
- Bitcoin (BTC)
- Ethereum (ETH)
- All major cryptocurrencies

### API Documentation:
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)

---

## Testing Your API Keys

After adding your API keys to `.env`, test them:

```bash
# Make sure .env file exists
cp .env.example .env

# Add your API keys to .env

# Restart Metro bundler
npm start -- --reset-cache
```

## Rate Limiting

Both APIs have rate limits. The app includes:
- Automatic retry logic
- Error handling for rate limit errors
- Caching to minimize API calls

### Best Practices:
- Don't make unnecessary API calls
- Use the built-in caching
- Respect rate limits
- Consider upgrading to paid tiers for production

## Alternative APIs

If you need more features or higher limits, consider:

### For Stocks:
- **Alpha Vantage**: 25 requests/day (free)
- **Finnhub**: 60 calls/minute (free)
- **IEX Cloud**: 50,000 messages/month (free)

### For Crypto:
- **CoinMarketCap**: 10,000 calls/month (free)
- **Binance API**: High limits, free

## Troubleshooting

### "Invalid API Key" Error:
- Double-check your API key in `.env`
- Make sure there are no extra spaces
- Restart the Metro bundler

### "Rate Limit Exceeded":
- Wait a few minutes before trying again
- Reduce the frequency of API calls
- Consider caching data locally

### "No Data Returned":
- Verify the symbol/coin ID is correct
- Check if the market is open (for stocks)
- Try a different symbol to test

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to Git
- `.env` is already in `.gitignore`
- Don't share your API keys publicly
- Rotate keys if accidentally exposed

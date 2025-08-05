# RAWG API Integration Setup

This project uses the RAWG Video Games Database API to populate game data.

## Setup Instructions

1. **Get a Free API Key**
   - Go to [https://rawg.io/apidocs](https://rawg.io/apidocs)
   - Click on "Get API Key"
   - Create a free account
   - Copy your API key

2. **Add API Key to Environment**
   - Open `/backend/.env`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
     ```
     RAWG_API_KEY=your_actual_api_key_here
     ```

3. **Populate Database with Games**
   ```bash
   cd backend
   node scripts/populateGames.js
   ```
   
   Or specify number of games:
   ```bash
   node scripts/populateGames.js 100  # Import 100 games
   ```

## API Endpoints

### Import Games (Requires Authentication)
```
POST /api/import/import-from-rawg
Body: { page: 1, pageSize: 20 }
```

### Search RAWG Database
```
GET /api/import/search-rawg?query=zelda&page=1
```

## Rate Limits

The free RAWG API has the following limits:
- 20,000 requests per month
- No more than 5 requests per second

The import script includes delays to respect these limits.

## Notes

- The script will skip games that already exist in the database
- Games are imported with the highest-rated games first
- Each game includes: title, platform, developer, publisher, release date, genres, description, cover image, and ratings
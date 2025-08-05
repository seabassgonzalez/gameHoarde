import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { MarketplaceListing } from '../types';

const Marketplace: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sortBy: 'createdAt',
  });

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Debounce price inputs
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ 
        ...prev, 
        minPrice: minPriceInput,
        maxPrice: maxPriceInput 
      }));
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [minPriceInput, maxPriceInput]);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace', filters],
    queryFn: async () => {
      const response = await api.get('/marketplace', {
        params: filters,
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        Marketplace
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextField
          label="Search listings"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Min Price"
          type="number"
          value={minPriceInput}
          onChange={(e) => setMinPriceInput(e.target.value)}
          size="small"
          sx={{ width: 120 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPriceInput}
          onChange={(e) => setMaxPriceInput(e.target.value)}
          size="small"
          sx={{ width: 120 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          select
          label="Condition"
          value={filters.condition}
          onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Conditions</MenuItem>
          {['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((cond) => (
            <MenuItem key={cond} value={cond}>{cond}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort by"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="createdAt">Newest</MenuItem>
          <MenuItem value="price">Price: Low to High</MenuItem>
          <MenuItem value="-price">Price: High to Low</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {listings?.listings.map((listing: MarketplaceListing) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={listing.photos[0] || listing.game.coverImage || '/placeholder-game.png'}
                alt={listing.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap gutterBottom>
                  {listing.title}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip label={listing.game.platform} size="small" color="primary" sx={{ mr: 1 }} />
                  <Chip label={listing.condition} size="small" variant="outlined" />
                </Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  ${listing.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller: {listing.seller.username} ⭐ {listing.seller.reputation.rating.toFixed(1)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {listing.views} views
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/marketplace/${listing._id}`}
                  size="small"
                  fullWidth
                  variant="contained"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
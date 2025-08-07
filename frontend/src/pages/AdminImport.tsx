import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminImport: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [marketplaceCount, setMarketplaceCount] = useState(10);
  const [marketplaceResult, setMarketplaceResult] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.username !== 'seabassgonzalez') {
      navigate('/');
    } else {
      fetchStats();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/marketplace-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/import/import-from-rawg', {
        page,
        pageSize,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndImport = async (searchQuery: string) => {
    setLoading(true);
    setError('');

    try {
      // First search for games
      const searchResponse = await api.get('/import/search-rawg', {
        params: { query: searchQuery, page: 1 },
      });

      // Then import each game
      let imported = 0;
      for (const game of searchResponse.data.games) {
        try {
          await api.post('/games', game);
          imported++;
        } catch (err) {
          console.error('Failed to import game:', game.title);
        }
      }

      setResult({ imported, total: searchResponse.data.games.length });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search and import failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateMarketplace = async () => {
    setLoading(true);
    setError('');
    setMarketplaceResult(null);

    try {
      const response = await api.post('/admin/populate-marketplace', {
        count: marketplaceCount,
      });
      setMarketplaceResult(response.data);
      fetchStats(); // Refresh stats
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to populate marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleClearMarketplace = async () => {
    if (!window.confirm('Are you sure you want to clear all marketplace listings?')) {
      return;
    }

    setLoading(true);
    try {
      await api.delete('/admin/clear-marketplace');
      setMarketplaceResult({ message: 'Marketplace cleared successfully' });
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to clear marketplace');
    } finally {
      setLoading(false);
    }
  };

  // Early return if user is not logged in or not admin
  if (!user || user.username !== 'seabassgonzalez') {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Tools
        </Typography>

        {stats && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Statistics
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Listings
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Active Listings
                </Typography>
                <Typography variant="h5" color="success.main">
                  {stats.active}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Sold Listings
                </Typography>
                <Typography variant="h5" color="info.main">
                  {stats.sold}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Price
                </Typography>
                <Typography variant="h5">
                  ${stats.averagePrice?.toFixed(2) || '0'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Game Import
            </Typography>

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bulk Import from RAWG
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Import popular games from RAWG database
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'flex-end' }}>
                  <TextField
                    label="Page"
                    type="number"
                    value={page}
                    onChange={(e) => setPage(Number(e.target.value))}
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Page Size"
                    type="number"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{ width: 120 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleImport}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Import Games'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search and Import
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Search for specific games to import
                </Typography>

                <TextField
                  fullWidth
                  label="Search games (e.g., 'Mario', 'Zelda', 'Final Fantasy')"
                  sx={{ mt: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchAndImport((e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Marketplace Tools
            </Typography>

            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Populate Marketplace
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Create dummy marketplace listings for testing
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'flex-end' }}>
                  <TextField
                    label="Number of Listings"
                    type="number"
                    value={marketplaceCount}
                    onChange={(e) => setMarketplaceCount(Number(e.target.value))}
                    sx={{ width: 150 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePopulateMarketplace}
                    disabled={loading}
                    color="success"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Listings'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Use with caution!
                </Typography>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearMarketplace}
                  disabled={loading}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Clear All Marketplace Listings
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {result && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Import completed! Imported: {result.imported}, Skipped: {result.skipped || 0}, Total: {result.total}
          </Alert>
        )}

        {marketplaceResult && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {marketplaceResult.message || `Created ${marketplaceResult.created} marketplace listings!`}
            {marketplaceResult.errors > 0 && ` (${marketplaceResult.errors} errors)`}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default AdminImport;
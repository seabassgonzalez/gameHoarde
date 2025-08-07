import React, { useState } from 'react';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  // For now, any logged-in user can import. In production, add admin check
  if (!user) {
    navigate('/login');
    return null;
  }

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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Import Games from RAWG
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk Import
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

        {result && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Import completed! Imported: {result.imported}, Skipped: {result.skipped || 0}, Total: {result.total}
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
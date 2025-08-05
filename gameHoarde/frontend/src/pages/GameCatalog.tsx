import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Game } from '../types';

const GameCatalog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const { data, isLoading } = useQuery({
    queryKey: ['games', page, search, platform, sortBy],
    queryFn: async () => {
      const response = await api.get('/games', {
        params: { page, search, platform, sortBy, limit: 12 },
      });
      return response.data;
    },
  });

  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: async () => {
      const response = await api.get('/games/metadata/platforms');
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
    <Box>
      <Typography variant="h4" gutterBottom>
        Game Catalog
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search games"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Platforms</MenuItem>
          {platforms?.map((p: string) => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="releaseDate">Release Date</MenuItem>
          <MenuItem value="platform">Platform</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {data?.games.map((game: Game) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={game._id}>
            <Card
              component={Link}
              to={`/games/${game._id}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={game.coverImage || '/placeholder-game.png'}
                alt={game.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {game.title}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip label={game.platform} size="small" color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {game.developer}
                </Typography>
                {game.releaseDate && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(game.releaseDate).getFullYear()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data?.totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default GameCatalog;
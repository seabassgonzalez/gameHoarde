import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Game } from '../types';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const [collectionData, setCollectionData] = useState({
    condition: 'Very Good',
    completeness: 'CIB',
    purchasePrice: '',
    notes: '',
  });

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const response = await api.get(`/games/${id}`);
      return response.data as Game;
    },
  });

  const addToCollectionMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/collections/add', { ...data, gameId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] });
      setAddToCollectionOpen(false);
      setCollectionData({
        condition: 'Very Good',
        completeness: 'CIB',
        purchasePrice: '',
        notes: '',
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      return api.post('/collections/wishlist/add', { gameId: id, priority: 'Medium' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] });
    },
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!game) {
    return <Alert severity="error">Game not found</Alert>;
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardMedia
              component="img"
              image={game.coverImage || '/placeholder-game.png'}
              alt={game.title}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h3" gutterBottom>
            {game.title}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Chip label={game.platform} color="primary" sx={{ mr: 1 }} />
            {game.genres?.map((genre) => (
              <Chip key={genre} label={genre} variant="outlined" sx={{ mr: 1 }} />
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            <strong>Developer:</strong> {game.developer || 'Unknown'}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Publisher:</strong> {game.publisher || 'Unknown'}
          </Typography>
          {game.releaseDate && (
            <Typography variant="body1" paragraph>
              <strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}
            </Typography>
          )}
          {game.rarity && (
            <Typography variant="body1" paragraph>
              <strong>Rarity:</strong> {game.rarity}
            </Typography>
          )}

          {game.description && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {game.description}
              </Typography>
            </Box>
          )}

          {user && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddToCollectionOpen(true)}
                sx={{ mr: 2 }}
              >
                Add to Collection
              </Button>
              <Button
                variant="outlined"
                startIcon={<FavoriteIcon />}
                onClick={() => addToWishlistMutation.mutate()}
              >
                Add to Wishlist
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog open={addToCollectionOpen} onClose={() => setAddToCollectionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add to Collection</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Condition"
            value={collectionData.condition}
            onChange={(e) => setCollectionData({ ...collectionData, condition: e.target.value })}
            margin="normal"
          >
            {['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((cond) => (
              <MenuItem key={cond} value={cond}>{cond}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Completeness"
            value={collectionData.completeness}
            onChange={(e) => setCollectionData({ ...collectionData, completeness: e.target.value })}
            margin="normal"
          >
            {['CIB', 'No Manual', 'Cart Only', 'Disc Only', 'Digital'].map((comp) => (
              <MenuItem key={comp} value={comp}>{comp}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Purchase Price"
            type="number"
            value={collectionData.purchasePrice}
            onChange={(e) => setCollectionData({ ...collectionData, purchasePrice: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={collectionData.notes}
            onChange={(e) => setCollectionData({ ...collectionData, notes: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddToCollectionOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => addToCollectionMutation.mutate(collectionData)}
            disabled={addToCollectionMutation.isPending}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameDetail;
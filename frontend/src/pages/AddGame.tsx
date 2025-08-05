import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Alert,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

const platforms = [
  'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'PlayStation 2', 'PlayStation',
  'PlayStation Vita', 'PSP',
  'Xbox Series S/X', 'Xbox One', 'Xbox 360', 'Xbox',
  'Nintendo Switch', 'Wii U', 'Wii', 'GameCube', 'Nintendo 64', 'SNES', 'NES',
  'Nintendo 3DS', 'Nintendo DS', 'Game Boy Advance', 'Game Boy Color', 'Game Boy',
  'PC', 'macOS', 'Linux',
  'iOS', 'Android',
  'Sega Genesis', 'Sega Saturn', 'Dreamcast',
  'Atari 2600', 'Other'
];

const regions = ['NTSC-U/C', 'PAL', 'NTSC-J', 'Region Free', 'Digital'];

const rarityLevels = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Ultra Rare'];

const commonGenres = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing',
  'Fighting', 'Shooter', 'Platformer', 'Puzzle', 'Horror', 'Survival',
  'Battle Royale', 'MMORPG', 'MOBA', 'Card Game', 'Board Game', 'Educational',
  'Music/Rhythm', 'Visual Novel', 'Sandbox', 'Stealth', 'Turn-Based Strategy',
  'Real-Time Strategy', 'Tower Defense', 'Roguelike', 'Metroidvania'
];

const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    developer: '',
    publisher: '',
    releaseDate: '',
    genres: [] as string[],
    description: '',
    coverImage: '',
    barcode: '',
    region: '',
    rarity: '',
  });
  const [error, setError] = useState('');
  const [duplicateGame, setDuplicateGame] = useState<any>(null);

  const addGameMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/games', data);
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/games/${data._id}`);
    },
    onError: (error: any) => {
      if (error.response?.data?.existingGame) {
        setDuplicateGame(error.response.data.existingGame);
        setError(error.response.data.error);
      } else {
        setError(error.response?.data?.error || 'Failed to add game');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDuplicateGame(null);

    if (!formData.title || !formData.platform) {
      setError('Title and platform are required');
      return;
    }

    addGameMutation.mutate(formData);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Add New Game
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Can't find a game in our database? Add it here!
        </Typography>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {error && (
                <Grid size={12}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                    {duplicateGame && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Found: {duplicateGame.title} ({duplicateGame.platform})
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => navigate(`/games/${duplicateGame._id}`)}
                          sx={{ mt: 1 }}
                        >
                          View Existing Game
                        </Button>
                      </Box>
                    )}
                  </Alert>
                </Grid>
              )}

              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  label="Game Title"
                  value={formData.title}
                  onChange={handleChange('title')}
                  helperText="Enter the exact title as it appears on the game"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Platform"
                  value={formData.platform}
                  onChange={handleChange('platform')}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Release Date"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange('releaseDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Developer"
                  value={formData.developer}
                  onChange={handleChange('developer')}
                  helperText="Company that developed the game"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Publisher"
                  value={formData.publisher}
                  onChange={handleChange('publisher')}
                  helperText="Company that published the game"
                />
              </Grid>

              <Grid size={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={commonGenres}
                  value={formData.genres}
                  onChange={(_, newValue) => {
                    setFormData({ ...formData, genres: newValue });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Genres"
                      placeholder="Add genres..."
                      helperText="Select from list or type to add custom genres"
                    />
                  )}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange('description')}
                  helperText="Brief description of the game"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cover Image URL"
                  value={formData.coverImage}
                  onChange={handleChange('coverImage')}
                  helperText="Direct link to cover image"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Barcode/UPC"
                  value={formData.barcode}
                  onChange={handleChange('barcode')}
                  helperText="Product barcode if available"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Region"
                  value={formData.region}
                  onChange={handleChange('region')}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Rarity"
                  value={formData.rarity}
                  onChange={handleChange('rarity')}
                >
                  <MenuItem value="">Not specified</MenuItem>
                  {rarityLevels.map((rarity) => (
                    <MenuItem key={rarity} value={rarity}>
                      {rarity}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {formData.coverImage && (
                <Grid size={12}>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cover Preview:
                    </Typography>
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '300px',
                        objectFit: 'contain',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Box>
                </Grid>
              )}

              <Grid size={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/games')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={addGameMutation.isPending}
                  >
                    {addGameMutation.isPending ? <CircularProgress size={24} /> : 'Add Game'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddGame;
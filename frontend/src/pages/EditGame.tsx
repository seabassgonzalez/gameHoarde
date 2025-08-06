import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Save as SaveIcon, 
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Game } from '../types';

const platforms = [
  // Current Generation
  'Nintendo Switch 2',
  'PlayStation 5',
  'Xbox Series X',
  'Xbox Series S',
  'Steam Deck',
  'Meta Quest 3',
  'PlayStation VR2',
  
  // Previous Generation
  'Nintendo Switch',
  'PlayStation 4',
  'Xbox One',
  'Meta Quest 2',
  'PlayStation VR',
  
  // Older PlayStation
  'PlayStation 3',
  'PlayStation 2',
  'PlayStation',
  'PlayStation Vita',
  'PSP',
  
  // Older Xbox
  'Xbox 360',
  'Xbox',
  
  // Older Nintendo Home
  'Wii U',
  'Wii',
  'GameCube',
  'Nintendo 64',
  'SNES',
  'NES',
  
  // Nintendo Handhelds
  'Nintendo 3DS',
  'Nintendo DS',
  'Game Boy Advance',
  'Game Boy Color',
  'Game Boy',
  
  // PC/Mobile
  'PC',
  'macOS',
  'Linux',
  'iOS',
  'Android',
  
  // Sega
  'Dreamcast',
  'Sega Saturn',
  'Sega Genesis',
  'Sega CD',
  'Game Gear',
  
  // Classic/Retro
  'Neo Geo',
  'Neo Geo Pocket',
  'TurboGrafx-16',
  'Atari Jaguar',
  'Atari 7800',
  'Atari 5200',
  'Atari 2600',
  '3DO',
  'Commodore 64',
  'Amiga',
  'Arcade',
  
  // Other
  'Other'
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

const EditGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageTab, setImageTab] = useState(0); // 0 for URL, 1 for Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
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
  const [loading, setLoading] = useState(true);

  // Fetch game data
  const { data: game, isLoading: queryLoading, error: queryError } = useQuery<Game>({
    queryKey: ['game', id],
    queryFn: async () => {
      const response = await api.get<Game>(`/games/${id}`);
      return response.data;
    },
  });

  // Update form data when game data is loaded
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || '',
        platform: game.platform || '',
        developer: game.developer || '',
        publisher: game.publisher || '',
        releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split('T')[0] : '',
        genres: game.genres || [],
        description: game.description || '',
        coverImage: game.coverImage || '',
        barcode: game.barcode || '',
        region: game.region || '',
        rarity: game.rarity || '',
      });
      setLoading(false);
    }
  }, [game]);

  useEffect(() => {
    if (queryError) {
      setError('Failed to load game data');
      setLoading(false);
    }
  }, [queryError]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (uploadedImageUrl && uploadedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const updateGameMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.put(`/games/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/games/${data._id}`);
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update game');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.platform) {
      setError('Title and platform are required');
      return;
    }

    updateGameMutation.mutate(formData);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setError('');
    setUploadedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImageUrl(previewUrl);
  };

  const handleImageUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', uploadedFile);

    try {
      const response = await api.post('/upload/game-image', uploadFormData);

      const imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${response.data.imageUrl}`;
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      setUploading(false);
      setError('');
    } catch (error: any) {
      setUploading(false);
      setError(error.response?.data?.error || 'Failed to upload image');
      console.error('Upload error:', error);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setUploadedImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Check if user can edit
  const canEdit = user && (
    user.role === 'admin' || 
    (game?.metadata?.userSubmitted && game?.metadata?.addedBy === user._id)
  );

  if (!canEdit) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            You are not authorized to edit this game.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate(`/games/${id}`)}
            sx={{ mt: 2 }}
          >
            Back to Game
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Edit Game
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Update game information
        </Typography>

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {error && (
                <Grid size={12}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
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

              <Grid size={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Cover Image
                  </Typography>
                  <Tabs value={imageTab} onChange={(_, value) => setImageTab(value)} sx={{ mb: 2 }}>
                    <Tab label="URL" />
                    <Tab label="Upload" />
                  </Tabs>

                  {imageTab === 0 ? (
                    <TextField
                      fullWidth
                      label="Cover Image URL"
                      value={formData.coverImage}
                      onChange={handleChange('coverImage')}
                      helperText="Direct link to cover image"
                    />
                  ) : (
                    <Box>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      
                      {!uploadedFile ? (
                        <Button
                          variant="outlined"
                          startIcon={<ImageIcon />}
                          onClick={() => fileInputRef.current?.click()}
                          fullWidth
                          sx={{ py: 2 }}
                        >
                          Select New Image File
                        </Button>
                      ) : (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                            <IconButton onClick={handleRemoveImage} size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={handleImageUpload}
                            disabled={uploading}
                            fullWidth
                          >
                            {uploading ? <CircularProgress size={24} /> : 'Upload New Image'}
                          </Button>
                        </Box>
                      )}
                      
                      {uploadedImageUrl && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <Typography variant="caption" display="block" gutterBottom>
                            New Image Preview
                          </Typography>
                          <img
                            src={uploadedImageUrl}
                            alt="Preview"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '300px',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
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
                      Current Cover:
                    </Typography>
                    <img
                      src={formData.coverImage}
                      alt="Current cover"
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
                    onClick={() => navigate(`/games/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={updateGameMutation.isPending}
                  >
                    {updateGameMutation.isPending ? <CircularProgress size={24} /> : 'Save Changes'}
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

export default EditGame;
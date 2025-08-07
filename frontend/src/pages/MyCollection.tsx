import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import GameImage from '../components/GameImage';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MyCollection: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-collection', user?.username],
    queryFn: async () => {
      const response = await api.get('/collections/my-collection');
      return response.data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['collection-stats'],
    queryFn: async () => {
      const response = await api.get('/collections/stats');
      return response.data;
    },
  });

  const removeFromCollectionMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return api.delete(`/collections/item/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collection', user?.username] });
      queryClient.invalidateQueries({ queryKey: ['collection-stats'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return api.delete(`/collections/wishlist/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-collection', user?.username] });
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
        My Collection
      </Typography>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{stats.totalGames}</Typography>
              <Typography color="text.secondary">Total Games</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">${stats.totalValue.toFixed(2)}</Typography>
              <Typography color="text.secondary">Total Value</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`Collection (${userData?.gameCollection.length || 0})`} />
          <Tab label={`Wishlist (${userData?.wishlist.length || 0})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {userData?.gameCollection.map((item: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component={Link}
                  to={`/games/${item.game?._id || ''}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  <GameImage
                    src={item.game?.coverImage}
                    alt={item.game?.title || 'Game'}
                    height={200}
                  />
                </CardMedia>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    gutterBottom
                    component={Link}
                    to={`/games/${item.game?._id || ''}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {item.game?.title || 'Unknown Game'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={item.game?.platform || 'Unknown'} size="small" color="primary" sx={{ mr: 1 }} />
                    <Chip label={item.condition} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.completeness}
                  </Typography>
                  {item.purchasePrice && (
                    <Typography variant="body2">
                      Paid: ${item.purchasePrice}
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => removeFromCollectionMutation.mutate(item._id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {userData?.wishlist.map((item: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component={Link}
                  to={`/games/${item.game?._id || ''}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  <GameImage
                    src={item.game?.coverImage}
                    alt={item.game?.title || 'Game'}
                    height={200}
                  />
                </CardMedia>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    gutterBottom
                    component={Link}
                    to={`/games/${item.game?._id || ''}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {item.game?.title || 'Unknown Game'}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={item.game?.platform || 'Unknown'} size="small" color="primary" sx={{ mr: 1 }} />
                    <Chip 
                      label={`Priority: ${item.priority}`} 
                      size="small" 
                      color={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'default'} 
                    />
                  </Box>
                  {item.maxPrice && (
                    <Typography variant="body2" color="text.secondary">
                      Max Price: ${item.maxPrice}
                    </Typography>
                  )}
                  {item.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {item.notes}
                    </Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => removeFromWishlistMutation.mutate(item._id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default MyCollection;
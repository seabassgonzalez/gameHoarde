import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

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
    queryKey: ['user', user?.username],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
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
      queryClient.invalidateQueries({ queryKey: ['user', user?.username] });
      queryClient.invalidateQueries({ queryKey: ['collection-stats'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return api.delete(`/collections/wishlist/${itemId}`);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Collection
      </Typography>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{stats.totalGames}</Typography>
              <Typography color="text.secondary">Total Games</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">${stats.totalValue.toFixed(2)}</Typography>
              <Typography color="text.secondary">Total Value</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label={`Collection (${userData?.gameCollection.length || 0})`} />
        <Tab label={`Wishlist (${userData?.wishlist.length || 0})`} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {userData?.gameCollection.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.game.coverImage || '/placeholder-game.png'}
                  alt={item.game.title}
                />
                <CardContent>
                  <Typography variant="h6" noWrap gutterBottom>
                    {item.game.title}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={item.game.platform} size="small" color="primary" sx={{ mr: 1 }} />
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
        <List>
          {userData?.wishlist.map((item: any) => (
            <ListItem key={item._id}>
              <ListItemText
                primary={item.game.title}
                secondary={
                  <>
                    {item.game.platform} • Priority: {item.priority}
                    {item.maxPrice && ` • Max: $${item.maxPrice}`}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => removeFromWishlistMutation.mutate(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>
    </Box>
  );
};

export default MyCollection;
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [tabValue, setTabValue] = React.useState(0);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      const response = await api.get(`/users/profile/${username}`);
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

  if (error || !user) {
    return <Alert severity="error">User not found</Alert>;
  }

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Avatar
              sx={{ width: 120, height: 120, fontSize: 48 }}
              src={user.profile.avatar}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size="grow">
            <Typography variant="h4" gutterBottom>
              {user.profile.displayName || user.username}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            {user.profile.bio && (
              <Typography variant="body1" paragraph>
                {user.profile.bio}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {user.profile.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">{user.profile.location}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">
                  Joined {new Date(user.profile.joinDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'gold' }} />
                <Typography variant="body2">
                  {user.reputation.rating.toFixed(1)} ({user.reputation.totalRatings} ratings)
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{user.gameCollection.length}</Typography>
            <Typography color="text.secondary">Games in Collection</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{user.wishlist.length}</Typography>
            <Typography color="text.secondary">Games in Wishlist</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{user.reputation.completedTransactions}</Typography>
            <Typography color="text.secondary">Completed Trades</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Collection" />
        <Tab label="Wishlist" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {user.gameCollection.map((item: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" noWrap>
                    {item.game.title}
                  </Typography>
                  <Chip label={item.game.platform} size="small" sx={{ mr: 1, mt: 1 }} />
                  <Chip label={item.condition} size="small" variant="outlined" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.completeness}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {user.wishlist.map((item: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" noWrap>
                    {item.game.title}
                  </Typography>
                  <Chip label={item.game.platform} size="small" sx={{ mr: 1, mt: 1 }} />
                  <Chip
                    label={`Priority: ${item.priority}`}
                    size="small"
                    color={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'default'}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
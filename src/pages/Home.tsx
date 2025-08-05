import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
} from '@mui/material';
import {
  Games as GamesIcon,
  Store as StoreIcon,
  Collections as CollectionsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to GameHoard
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The ultimate platform for video game collectors
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/games"
          >
            Browse Games
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <GamesIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Vast Game Database
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse thousands of games across all platforms and generations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CollectionsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Your Collection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Catalog your games with condition, value, and completeness details
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <StoreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Buy & Sell
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with collectors to buy, sell, and trade games
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Values
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor market trends and the value of your collection
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Join thousands of collectors
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Start building your digital game library today
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
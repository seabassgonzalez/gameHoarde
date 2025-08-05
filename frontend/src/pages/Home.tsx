import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Paper,
  Chip,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Games as GamesIcon,
  Store as StoreIcon,
  Collections as CollectionsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <GamesIcon sx={{ fontSize: 48 }} />,
      title: 'Comprehensive Database',
      description: 'Access detailed information for over 50,000 games across all platforms',
      color: theme.palette.primary.main,
    },
    {
      icon: <CollectionsIcon sx={{ fontSize: 48 }} />,
      title: 'Collection Management',
      description: 'Track condition, completeness, purchase price, and organize your library',
      color: theme.palette.secondary.main,
    },
    {
      icon: <StoreIcon sx={{ fontSize: 48 }} />,
      title: 'Marketplace',
      description: 'Buy, sell, and trade with verified collectors in a secure environment',
      color: theme.palette.success.main,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: 'Value Tracking',
      description: 'Monitor your collection value with real-time market data',
      color: theme.palette.warning.main,
    },
    {
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      title: 'Advanced Search',
      description: 'Find games by platform, genre, developer, year, and more',
      color: theme.palette.info.main,
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 48 }} />,
      title: 'Secure & Trusted',
      description: 'Safe transactions with user ratings and verified profiles',
      color: theme.palette.error.main,
    },
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      avatar: 'A',
      role: 'Retro Game Collector',
      content: 'GameHorde helped me catalog my 500+ game collection. The value tracking feature is amazing!',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      avatar: 'S',
      role: 'PlayStation Enthusiast',
      content: 'I found rare PS1 games I\'ve been searching for years. The marketplace is a game-changer!',
      rating: 5,
    },
    {
      name: 'Mike Williams',
      avatar: 'M',
      role: 'Nintendo Collector',
      content: 'The condition grading system is perfect. I know exactly what I\'m buying and selling.',
      rating: 5,
    },
  ];

  const stats = [
    { value: '50K+', label: 'Games Listed' },
    { value: '10K+', label: 'Active Collectors' },
    { value: '$2M+', label: 'Total Sales' },
    { value: '4.8', label: 'User Rating' },
  ];

  const platforms = [
    'PlayStation', 'Xbox', 'Nintendo', 'PC', 'Sega', 'Atari', 
    'Neo Geo', 'TurboGrafx', 'Game Boy', 'PSP', 'PS Vita', '3DS'
  ];

  const faqs = [
    {
      question: 'How much does GameHorde cost?',
      answer: 'GameHorde is free to join! Create your account, catalog your collection, and browse the marketplace at no cost. We only charge a small fee on successful marketplace transactions.'
    },
    {
      question: 'How do I add games to my collection?',
      answer: 'Simply search for a game using our comprehensive database, select the correct edition/platform, and add it to your collection. You can specify condition, completeness, purchase price, and add personal notes.'
    },
    {
      question: 'Is the marketplace safe for buying and selling?',
      answer: 'Yes! We use secure payment processing, hold funds in escrow until delivery is confirmed, and have a rating system for buyers and sellers. All users are verified to ensure a safe trading environment.'
    },
    {
      question: 'Can I track the value of my collection?',
      answer: 'Absolutely! GameHorde provides real-time market valuations based on recent sales data. You can see your collection\'s total value, individual game values, and track changes over time.'
    },
    {
      question: 'What platforms and games are supported?',
      answer: 'We support all major gaming platforms from retro consoles to modern systems. Our database includes over 50,000 games and is constantly growing. If a game is missing, you can request to add it.'
    },
    {
      question: 'Can I export my collection data?',
      answer: 'Yes, you can export your entire collection as a CSV file at any time. Your data is always yours, and we make it easy to download for backup or use in other applications.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          pt: 8,
          pb: 10,
          mt: -3,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Your Ultimate Game Collection Hub
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Catalog, value, and trade your video game collection with thousands of collectors worldwide
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="medium"
                  component={Link}
                  to="/register"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    boxShadow: 4,
                  }}
                >
                  Start Free Today
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  component={Link}
                  to="/games"
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  Explore Games
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip icon={<CheckCircleIcon />} label="Free to join" color="success" />
                <Chip icon={<CheckCircleIcon />} label="No credit card required" color="success" />
                <Chip icon={<CheckCircleIcon />} label="Instant setup" color="success" />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  height: 400,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <GamesIcon sx={{ fontSize: 200, color: 'white', opacity: 0.3 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                  <Paper sx={{ p: 2, background: alpha(theme.palette.background.paper, 0.9) }}>
                    <Typography variant="h4" color="primary">50K+</Typography>
                    <Typography variant="body2">Games Available</Typography>
                  </Paper>
                </Box>
                <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                  <Paper sx={{ p: 2, background: alpha(theme.palette.background.paper, 0.9) }}>
                    <Typography variant="h4" color="secondary">10K+</Typography>
                    <Typography variant="body2">Active Collectors</Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {stats.map((stat) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  background: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3,
                }}
              >
                <Typography variant="h3" color="primary" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Everything You Need to Manage Your Collection
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto 2rem',
                        borderRadius: '50%',
                        background: alpha(feature.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" gutterBottom>
                  Create Your Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign up for free and set up your collector profile in minutes
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" gutterBottom>
                  Add Your Games
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Search our database and add games to your collection with condition details
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" gutterBottom>
                  Connect & Trade
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse the marketplace, make offers, and grow your collection
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Platforms Section */}
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Supporting All Major Platforms
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {platforms.map((platform) => (
              <Chip
                key={platform}
                label={platform}
                size="medium"
                sx={{ 
                  fontSize: '1rem',
                  py: 2.5,
                  px: 1,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Loved by Collectors Worldwide
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: 'gold', fontSize: 20 }} />
                      ))}
                    </Stack>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 12, md: 8 }}>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="h6">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          sx={{
            p: 6,
            mb: 6,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderRadius: 4,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Ready to Start Your Collection Journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join thousands of collectors who trust GameHorde to manage their gaming treasures
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              endIcon={<PeopleIcon />}
              sx={{ 
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                boxShadow: 4,
              }}
            >
              Join GameHorde Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/marketplace"
              sx={{ 
                py: 2,
                px: 5,
                fontSize: '1.2rem',
              }}
            >
              Browse Marketplace
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
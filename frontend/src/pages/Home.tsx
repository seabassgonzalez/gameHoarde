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
  Avatar,
  Stack,
  useTheme,
  alpha,
  IconButton,
  Fade,
} from '@mui/material';
import {
  Games as GamesIcon,
  Store as StoreIcon,
  Collections as CollectionsIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Search as SearchIcon,
  Star as StarIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const theme = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        id="hero"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.dark, 0.3)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.dark, 0.2)} 0%, transparent 50%),
                       ${theme.palette.background.default}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      letterSpacing: 3,
                      mb: 2,
                      display: 'block',
                    }}
                  >
                    WELCOME TO GAMEHOARDE
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '3rem', md: '4.5rem' },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 3,
                      background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${alpha(theme.palette.common.white, 0.8)} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Your Ultimate
                    <Box component="span" sx={{ color: 'primary.main', WebkitTextFillColor: theme.palette.primary.main }}>
                      {' '}Game Collection{' '}
                    </Box>
                    Hub
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'text.secondary',
                      mb: 4,
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Catalog, value, and trade your video game collection with thousands of collectors worldwide.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/register"
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Get Started Free
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/marketplace"
                      sx={{
                        py: 2,
                        px: 4,
                        fontSize: '1.1rem',
                        borderColor: alpha(theme.palette.common.white, 0.3),
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      Browse Marketplace
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ opacity: 0.8 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      No credit card required
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" color="success" />
                      Free forever plan
                    </Typography>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 500 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                      borderRadius: 4,
                      filter: 'blur(40px)',
                    }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <GamesIcon sx={{ fontSize: { xs: 200, md: 300 }, color: alpha(theme.palette.common.white, 0.1) }} />
                  </Box>
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      p: 3,
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    }}
                  >
                    <Typography variant="h3" color="primary" fontWeight="bold">50K+</Typography>
                    <Typography variant="body1" color="text.secondary">Games Listed</Typography>
                  </Paper>
                  <Paper
                    sx={{
                      position: 'absolute',
                      bottom: 40,
                      left: 20,
                      p: 3,
                      bgcolor: alpha(theme.palette.background.paper, 0.9),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    }}
                  >
                    <Typography variant="h3" color="secondary" fontWeight="bold">10K+</Typography>
                    <Typography variant="body1" color="text.secondary">Active Users</Typography>
                  </Paper>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
        <IconButton
          onClick={() => scrollToSection('features')}
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'text.secondary',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translateX(-50%) translateY(0)' },
              '40%': { transform: 'translateX(-50%) translateY(-10px)' },
              '60%': { transform: 'translateX(-50%) translateY(-5px)' },
            },
          }}
        >
          <ArrowDownwardIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 12, bgcolor: alpha(theme.palette.background.paper, 0.3) }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 3,
                mb: 2,
                display: 'block',
              }}
            >
              FEATURES
            </Typography>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
              Everything You Need
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Powerful tools to manage, track, and trade your game collection
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <GamesIcon />,
                title: 'Comprehensive Database',
                description: 'Access detailed information for over 50,000 games across all platforms',
                color: theme.palette.primary.main,
              },
              {
                icon: <CollectionsIcon />,
                title: 'Collection Management',
                description: 'Track condition, completeness, purchase price, and organize your library',
                color: theme.palette.secondary.main,
              },
              {
                icon: <StoreIcon />,
                title: 'Marketplace',
                description: 'Buy, sell, and trade with verified collectors in a secure environment',
                color: theme.palette.success.main,
              },
              {
                icon: <TrendingUpIcon />,
                title: 'Value Tracking',
                description: 'Monitor your collection value with real-time market data',
                color: theme.palette.warning.main,
              },
              {
                icon: <SearchIcon />,
                title: 'Advanced Search',
                description: 'Find games by platform, genre, developer, year, and more',
                color: theme.palette.info.main,
              },
              {
                icon: <ShieldIcon />,
                title: 'Secure & Trusted',
                description: 'Safe transactions with user ratings and verified profiles',
                color: theme.palette.error.main,
              },
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      borderColor: alpha(feature.color, 0.3),
                      boxShadow: `0 20px 40px ${alpha(feature.color, 0.1)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.2)} 100%)`,
                        color: feature.color,
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="600">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 12, position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { value: '50,000+', label: 'Games in Database', icon: <GamesIcon /> },
              { value: '10,000+', label: 'Active Collectors', icon: <CollectionsIcon /> },
              { value: '$2M+', label: 'Total Trading Volume', icon: <TrendingUpIcon /> },
              { value: '4.9/5', label: 'User Rating', icon: <StarIcon /> },
            ].map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 12, bgcolor: alpha(theme.palette.background.paper, 0.3) }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 3,
                mb: 2,
                display: 'block',
              }}
            >
              HOW IT WORKS
            </Typography>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
              Get Started in 3 Simple Steps
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up for free and set up your collector profile',
              },
              {
                step: '02',
                title: 'Build Your Collection',
                description: 'Add games, track condition, and organize your library',
              },
              {
                step: '03',
                title: 'Start Trading',
                description: 'Buy, sell, and trade with other verified collectors',
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: '5rem',
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="h5" gutterBottom fontWeight="600">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 3,
                mb: 2,
                display: 'block',
              }}
            >
              TESTIMONIALS
            </Typography>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
              What Our Users Say
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: 'Alex Chen',
                role: 'Retro Game Collector',
                content: 'GameHoarde helped me catalog my 500+ game collection. The value tracking feature is amazing!',
                rating: 5,
                avatar: 'A',
              },
              {
                name: 'Sarah Johnson',
                role: 'PlayStation Enthusiast',
                content: "I found rare PS1 games I've been searching for years. The marketplace is a game-changer!",
                rating: 5,
                avatar: 'S',
              },
              {
                name: 'Mike Williams',
                role: 'Nintendo Collector',
                content: "The condition grading system is perfect. I know exactly what I'm buying and selling.",
                rating: 5,
                avatar: 'M',
              },
            ].map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{testimonial.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.8)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
              Ready to Start Your Collection?
            </Typography>
            <Typography variant="h5" sx={{ mb: 5, color: alpha(theme.palette.common.white, 0.9) }}>
              Join thousands of collectors managing their game libraries with GameHoarde
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                bgcolor: 'common.white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.9),
                  transform: 'scale(1.05)',
                },
              }}
            >
              Get Started Free
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
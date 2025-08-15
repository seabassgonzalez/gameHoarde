import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Games as GamesIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', path: '/#features' },
      { name: 'How It Works', path: '/#how-it-works' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'FAQ', path: '/#faq' },
    ],
    community: [
      { name: 'Game Catalog', path: '/games' },
      { name: 'Marketplace', path: '/marketplace' },
      { name: 'Collectors', path: '/collectors' },
      { name: 'Blog', path: '/blog' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Guidelines', path: '/guidelines' },
    ],
  };

  const socialLinks = [
    { icon: <TwitterIcon />, url: 'https://twitter.com/gamehorde', label: 'Twitter' },
    { icon: <FacebookIcon />, url: 'https://facebook.com/gamehorde', label: 'Facebook' },
    { icon: <InstagramIcon />, url: 'https://instagram.com/gamehorde', label: 'Instagram' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com/gamehorde', label: 'YouTube' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: alpha(theme.palette.background.paper, 0.8),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="space-between"
        >
          {/* Brand Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 35%' } }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <GamesIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              <Typography variant="h5" fontWeight="bold">
                GameHorde
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The ultimate platform for video game collectors. Catalog, value, and trade your collection with confidence.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Links Sections */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ flex: 1 }}>
            <Box sx={{ minWidth: 150 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Product
            </Typography>
            <Stack spacing={1}>
              {footerLinks.product.map((link) => (
                <Typography
                  key={link.name}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Community
            </Typography>
            <Stack spacing={1}>
              {footerLinks.community.map((link) => (
                <Typography
                  key={link.name}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <Stack spacing={1}>
              {footerLinks.company.map((link) => (
                <Typography
                  key={link.name}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 150 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              {footerLinks.legal.map((link) => (
                <Typography
                  key={link.name}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {link.name}
                </Typography>
              ))}
            </Stack>
          </Box>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} GameHorde. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              href="mailto:support@gamehorde.com"
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              support@gamehorde.com
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
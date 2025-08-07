import React, { useState } from 'react';
import { Box } from '@mui/material';
import { SportsEsports } from '@mui/icons-material';

interface GameImageProps {
  src?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

const GameImage: React.FC<GameImageProps> = ({ src, alt, width = '100%', height = 200 }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <Box
        sx={{
          width,
          height,
          backgroundColor: 'grey.800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'grey.500',
        }}
      >
        <SportsEsports sx={{ fontSize: 60 }} />
      </Box>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ width, height, objectFit: 'cover' }}
      onError={() => setError(true)}
    />
  );
};

export default GameImage;
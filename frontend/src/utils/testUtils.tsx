import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';

// Create a test theme
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

// Wrapper component with all providers
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockUser = {
  _id: '123',
  id: '123',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user' as const,
  profile: {
    displayName: 'Test User',
    joinDate: new Date('2023-01-01'),
  },
  gameCollection: [],
  wishlist: [],
  reputation: {
    rating: 5,
    totalRatings: 10,
    completedTransactions: 5,
  },
};

export const mockGame = {
  _id: '456',
  title: 'Test Game',
  platform: 'PlayStation 5',
  developer: 'Test Developer',
  publisher: 'Test Publisher',
  releaseDate: new Date('2023-06-01'),
  genres: ['Action', 'Adventure'],
  description: 'A test game description',
  coverImage: 'https://example.com/cover.jpg',
  metadata: {
    addedBy: '123',
    addedDate: new Date('2023-01-01'),
    userSubmitted: true,
  },
};

export const mockAuthContext = {
  user: mockUser,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

// Helper to mock authenticated state
export const mockAuthenticated = () => {
  const mockLocalStorage = {
    getItem: jest.fn((key) => {
      if (key === 'token') return 'mock-jwt-token';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
};
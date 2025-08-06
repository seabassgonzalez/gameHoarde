import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/testUtils';
import App from '../../App';
import { api } from '../../services/api';
import * as AuthContext from '../../contexts/AuthContext';

// Mock the API
jest.mock('../../services/api');

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

describe('Game Flow Integration Test', () => {
  const mockUser = {
    _id: '123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    profile: { displayName: 'Test User' },
    gameCollection: [],
    wishlist: [],
  };

  const mockGame = {
    _id: '456',
    title: 'Test Game',
    platform: 'PlayStation 5',
    developer: 'Test Developer',
    genres: ['Action'],
    description: 'Test description',
    coverImage: 'https://example.com/cover.jpg',
  };

  beforeEach(() => {
    // Mock authenticated user
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    // Mock API responses
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('/games') && url.includes('456')) {
        return Promise.resolve({ data: mockGame });
      }
      if (url.includes('/games')) {
        return Promise.resolve({
          data: {
            games: [mockGame],
            totalPages: 1,
            currentPage: 1,
            totalGames: 1,
          },
        });
      }
      if (url.includes('/users/me')) {
        return Promise.resolve({ data: mockUser });
      }
      return Promise.reject(new Error('Not found'));
    });

    (api.post as jest.Mock).mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('completes full game flow: browse -> view -> add to collection', async () => {
    render(<App />);

    // Navigate to games catalog
    fireEvent.click(screen.getByText('Games'));

    // Wait for games to load
    await waitFor(() => {
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    // Click on game to view details
    fireEvent.click(screen.getByText('Test Game'));

    // Wait for game details to load
    await waitFor(() => {
      expect(screen.getByText('Test Developer')).toBeInTheDocument();
      expect(screen.getByText('Add to Collection')).toBeInTheDocument();
    });

    // Click Add to Collection
    fireEvent.click(screen.getByText('Add to Collection'));

    // Dialog should open
    await waitFor(() => {
      expect(screen.getByText('Condition')).toBeInTheDocument();
      expect(screen.getByText('Completeness')).toBeInTheDocument();
    });

    // Select condition
    const conditionSelect = screen.getByLabelText('Condition');
    fireEvent.mouseDown(conditionSelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Mint'));
    });

    // Add to collection
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/collections/add',
        expect.objectContaining({
          gameId: '456',
          condition: 'Mint',
        })
      );
    });
  });

  it('allows searching and filtering games', async () => {
    render(<App />);

    // Navigate to games
    fireEvent.click(screen.getByText('Games'));

    await waitFor(() => {
      expect(screen.getByLabelText('Search games')).toBeInTheDocument();
    });

    // Search for a game
    const searchInput = screen.getByLabelText('Search games');
    fireEvent.change(searchInput, { target: { value: 'Zelda' } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/games'),
        expect.objectContaining({
          params: expect.objectContaining({
            search: 'Zelda',
          }),
        })
      );
    }, { timeout: 1000 });

    // Filter by platform
    const platformSelect = screen.getByLabelText('Platform');
    fireEvent.mouseDown(platformSelect);
    
    await waitFor(() => {
      const ps5Option = screen.getByText('PlayStation 5');
      fireEvent.click(ps5Option);
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/games'),
        expect.objectContaining({
          params: expect.objectContaining({
            platform: 'PlayStation 5',
          }),
        })
      );
    });
  });

  it('shows My Collection for authenticated users', async () => {
    // Mock user collection
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('/users/me')) {
        return Promise.resolve({
          data: {
            ...mockUser,
            gameCollection: [{
              _id: '789',
              game: mockGame,
              condition: 'Mint',
              completeness: 'CIB',
            }],
          },
        });
      }
      if (url.includes('/collections/stats')) {
        return Promise.resolve({
          data: {
            totalGames: 1,
            totalValue: 59.99,
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    render(<App />);

    // Navigate to My Collection
    fireEvent.click(screen.getByText('My Collection'));

    await waitFor(() => {
      expect(screen.getByText('Total Games')).toBeInTheDocument();
      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('Mint')).toBeInTheDocument();
    });
  });
});
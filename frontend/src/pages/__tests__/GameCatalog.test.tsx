import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/testUtils';
import GameCatalog from '../GameCatalog';
import { api } from '../../services/api';
import * as AuthContext from '../../contexts/AuthContext';

// Mock the API
jest.mock('../../services/api');

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

const mockGamesResponse = {
  games: [
    {
      _id: '1',
      title: 'The Legend of Zelda',
      platform: 'Nintendo Switch',
      developer: 'Nintendo',
      coverImage: 'https://example.com/zelda.jpg',
      releaseDate: '2023-05-12',
    },
    {
      _id: '2',
      title: 'Super Mario Bros',
      platform: 'Nintendo Switch',
      developer: 'Nintendo',
      coverImage: 'https://example.com/mario.jpg',
      releaseDate: '2023-10-20',
    },
  ],
  totalPages: 1,
  currentPage: 1,
  totalGames: 2,
};

describe('GameCatalog Component', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockGamesResponse });
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders game catalog with games', async () => {
    render(<GameCatalog />);

    expect(screen.getByText('Game Catalog')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('The Legend of Zelda')).toBeInTheDocument();
      expect(screen.getByText('Super Mario Bros')).toBeInTheDocument();
    });
  });

  it('shows search input and filters', () => {
    render(<GameCatalog />);

    expect(screen.getByLabelText('Search games')).toBeInTheDocument();
    expect(screen.getByLabelText('Platform')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('performs search when typing', async () => {
    render(<GameCatalog />);

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
  });

  it('shows add game button for authenticated users', () => {
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    render(<GameCatalog />);

    expect(screen.getByText('Add New Game')).toBeInTheDocument();
  });

  it('does not show add game button for unauthenticated users', () => {
    render(<GameCatalog />);

    expect(screen.queryByText('Add New Game')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<GameCatalog />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows no games message when empty', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        games: [],
        totalPages: 0,
        currentPage: 1,
        totalGames: 0,
      },
    });

    render(<GameCatalog />);

    await waitFor(() => {
      expect(screen.getByText('No games found')).toBeInTheDocument();
    });
  });

  it('filters by platform', async () => {
    render(<GameCatalog />);

    const platformSelect = screen.getByLabelText('Platform');
    fireEvent.mouseDown(platformSelect);
    
    await waitFor(() => {
      const option = screen.getByText('PlayStation 5');
      fireEvent.click(option);
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
});
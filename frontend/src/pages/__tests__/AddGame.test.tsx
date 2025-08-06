import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/testUtils';
import AddGame from '../AddGame';
import { api } from '../../services/api';
import * as RouterDom from 'react-router-dom';

// Mock the API
jest.mock('../../services/api');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom');

// Setup router mock
(RouterDom as any).useNavigate = () => mockNavigate;

describe('AddGame Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (api.post as jest.Mock).mockClear();
  });

  it('renders add game form', () => {
    render(<AddGame />);

    expect(screen.getByText('Add New Game')).toBeInTheDocument();
    expect(screen.getByLabelText('Game Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Platform')).toBeInTheDocument();
    expect(screen.getByLabelText('Developer')).toBeInTheDocument();
    expect(screen.getByLabelText('Publisher')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AddGame />);

    const submitButton = screen.getByText('Add Game');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title and platform are required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockGameResponse = {
      data: {
        _id: '123',
        title: 'New Game',
        platform: 'PlayStation 5',
      },
    };
    (api.post as jest.Mock).mockResolvedValue(mockGameResponse);

    render(<AddGame />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Game Title'), {
      target: { value: 'New Game' },
    });

    const platformSelect = screen.getByLabelText('Platform');
    fireEvent.mouseDown(platformSelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('PlayStation 5'));
    });

    // Submit form
    fireEvent.click(screen.getByText('Add Game'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/games', expect.objectContaining({
        title: 'New Game',
        platform: 'PlayStation 5',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/games/123');
    });
  });

  it('shows duplicate game error', async () => {
    const mockError = {
      response: {
        data: {
          error: 'A game with this title and platform already exists',
          existingGame: {
            _id: '456',
            title: 'Existing Game',
            platform: 'PlayStation 5',
          },
        },
      },
    };
    (api.post as jest.Mock).mockRejectedValue(mockError);

    render(<AddGame />);

    // Fill and submit
    fireEvent.change(screen.getByLabelText('Game Title'), {
      target: { value: 'Existing Game' },
    });
    
    const platformSelect = screen.getByLabelText('Platform');
    fireEvent.mouseDown(platformSelect);
    await waitFor(() => {
      fireEvent.click(screen.getByText('PlayStation 5'));
    });

    fireEvent.click(screen.getByText('Add Game'));

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument();
      expect(screen.getByText('View Existing Game')).toBeInTheDocument();
    });
  });

  it('handles genres selection', async () => {
    render(<AddGame />);

    const genresInput = screen.getByLabelText('Genres');
    fireEvent.focus(genresInput);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Action'));
      fireEvent.click(screen.getByText('RPG'));
    });

    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('RPG')).toBeInTheDocument();
  });

  it('shows image tabs', () => {
    render(<AddGame />);

    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('switches between URL and upload tabs', async () => {
    render(<AddGame />);

    // Initially URL tab is active
    expect(screen.getByLabelText('Cover Image URL')).toBeInTheDocument();

    // Click Upload tab
    fireEvent.click(screen.getByText('Upload'));

    await waitFor(() => {
      expect(screen.getByText('Select Image File')).toBeInTheDocument();
    });
  });

  it('cancels and navigates back', () => {
    render(<AddGame />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(mockNavigate).toHaveBeenCalledWith('/games');
  });
});
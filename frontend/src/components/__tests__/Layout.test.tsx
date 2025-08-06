import React from 'react';
import { render, screen } from '../../utils/testUtils';
import Layout from '../Layout';
import * as AuthContext from '../../contexts/AuthContext';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

describe('Layout Component', () => {
  beforeEach(() => {
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: null,
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });
  });

  it('renders navigation bar', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('GameHorde')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows login/register when not authenticated', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: {
        username: 'testuser',
        profile: { displayName: 'Test User' },
      },
      login: jest.fn(),
      logout: jest.fn(),
      loading: false,
    });

    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('My Collection')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText(/© 2024 GameHorde/)).toBeInTheDocument();
  });
});
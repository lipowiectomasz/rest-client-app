import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '@/components/login/SignUpForm';
import { signUp } from '@/actions/auth';

// Mock the dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'signUp.header': 'Sign Up',
      'common.name': 'Name',
      'common.email': 'Email',
      'common.password': 'Password',
      'common.placeholder.name': 'Enter your name',
      'common.placeholder.email': 'Enter your email',
      'common.placeholder.password': 'Enter password',
      'common.placeholder.confirmPassword': 'Confirm password',
      'common.loading': 'Loading...',
      'common.signUp': 'Sign Up',
    };
    return translations[key] || key;
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/signup',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/actions/auth', () => ({
  signUp: vi.fn(),
}));

// Create a mock for the zod module
vi.mock('@/lib/zod', () => ({
  signUpSchema: {
    parse: vi.fn(),
  },
}));

const mockParse = vi.fn();
const mockSignUpSchema = {
  parse: mockParse,
};

describe('SignUpForm', async () => {
  // Import the mocked module
  const { signUpSchema } = await import('@/lib/zod');

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation
    mockParse.mockImplementation(() => {
      throw {
        issues: [
          {
            path: ['name'],
            message: 'Name is required',
          },
          {
            path: ['email'],
            message: 'Valid email is required',
          },
          {
            path: ['password'],
            message: 'Password must be at least 8 characters',
          },
        ],
      };
    });
  });

  it('renders the sign up form correctly', () => {
    render(<SignUpForm />);

    // Check for the heading specifically
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    // Reset the mock to not throw an error
    mockParse.mockReturnValueOnce({});

    const mockSignUp = vi.mocked(signUp).mockResolvedValueOnce({ error: null });

    render(<SignUpForm />);

    fireEvent.input(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.input(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({ error: null }, expect.any(FormData));
    });
  });

  it('shows server error message', async () => {
    // Reset the mock to not throw an error
    mockParse.mockReturnValueOnce({});

    const mockSignUp = vi.mocked(signUp).mockResolvedValueOnce({
      error: 'Email already exists',
    });

    render(<SignUpForm />);

    // Fill form
    fireEvent.input(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    });
    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.input(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});

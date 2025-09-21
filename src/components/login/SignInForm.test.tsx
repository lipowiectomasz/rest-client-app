import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '@/components/login/SignInForm';
import { signIn } from 'next-auth/react';

const { mockParse, mockSignInSchema } = vi.hoisted(() => {
  const mockParse = vi.fn();
  const mockSignInSchema = {
    parse: mockParse,
  };
  return { mockParse, mockSignInSchema };
});

// Mock the dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'signIn.header': 'Sign In',
      'common.email': 'Email',
      'common.password': 'Password',
      'common.placeholder.email': 'Enter your email',
      'common.placeholder.password': 'Enter password',
      'common.loading': 'Loading...',
      'common.signIn': 'Sign In',
    };
    return translations[key] || key;
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: () => null, // No callback URL by default
  }),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock the zod module using the hoisted variables
vi.mock('@/lib/zod', () => ({
  signInSchema: mockSignInSchema,
}));

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation
    mockParse.mockImplementation(() => {
      throw {
        issues: [
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

  it('renders the sign in form correctly', () => {
    render(<SignInForm />);

    // Check for the heading specifically
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    // Reset the mock to not throw an error
    mockParse.mockReturnValueOnce({});

    const mockSignIn = vi.mocked(signIn).mockResolvedValueOnce({
      error: null,
      ok: true,
      status: 200,
      url: '/',
    } as any);

    render(<SignInForm />);

    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'Password123!',
        redirect: false,
      });
    });
  });

  it('shows server error message for invalid credentials', async () => {
    // Reset the mock to not throw an error
    mockParse.mockReturnValueOnce({});

    const mockSignIn = vi.mocked(signIn).mockResolvedValueOnce({
      error: 'Invalid credentials',
      ok: false,
      status: 401,
      url: null,
    } as any);

    render(<SignInForm />);

    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'WrongPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});

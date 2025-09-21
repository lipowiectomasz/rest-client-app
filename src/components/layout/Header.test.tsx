import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/components/layout/Header';
import { Session } from 'next-auth';

// Mock the dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'navigation.rest-client': 'REST Client',
      'navigation.history': 'History',
      'navigation.variables': 'Variables',
      'common.logOut': 'Log Out',
      'common.signIn': 'Sign In',
      'common.signUp': 'Sign Up',
    };
    return translations[key] || key;
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/rest-client',
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    Link: ({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }) => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
  }),
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    priority,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
  }) => <img src={src} alt={alt} width={width} height={height} data-priority={priority} />,
}));

vi.mock('@/i18n/routing', () => ({
  locales: ['en', 'es', 'de', 'ru', 'be'],
}));

// Mock the useState hook for sticky behavior
const mockSetIsSticky = vi.fn();
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => [false, mockSetIsSticky]),
    useEffect: vi.fn((fn) => fn()),
  };
});

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without session (logged out state)', () => {
    render(<Header session={null} />);

    // Check for logo
    expect(screen.getByAltText('RSS logo')).toBeInTheDocument();

    // Check for auth buttons when not logged in
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Check that protected links are not visible
    expect(screen.queryByText('REST Client')).not.toBeInTheDocument();
    expect(screen.queryByText('History')).not.toBeInTheDocument();
    expect(screen.queryByText('Variables')).not.toBeInTheDocument();

    // Check that logout button is not visible
    expect(screen.queryByText('Log Out')).not.toBeInTheDocument();
  });

  it('renders with session (logged in state)', () => {
    const mockSession: Session = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
      },
      expires: '2024-01-01T00:00:00.000Z',
    };

    render(<Header session={mockSession} />);

    // Check for logo
    expect(screen.getByAltText('RSS logo')).toBeInTheDocument();

    // Check for protected links when logged in
    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();

    // Check for logout button
    expect(screen.getByText('Log Out')).toBeInTheDocument();

    // Check that auth buttons are not visible
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });
});

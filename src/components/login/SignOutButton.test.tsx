import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignOutButton from './SignOutButton';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

import { signOut } from 'next-auth/react';

describe('<SignOutButton />', () => {
  it('renders the logout button', () => {
    render(<SignOutButton />);
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('calls signOut when the form is submitted', async () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /log out/i });

    fireEvent.click(button);

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});

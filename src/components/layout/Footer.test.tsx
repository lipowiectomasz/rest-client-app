import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'builtBy') return 'Built by:';
    if (key === 'text') return 'All rights reserved.';
    return key;
  },
}));

describe('Footer component', () => {
  it('renders author links with names', () => {
    render(<Footer />);

    expect(screen.getByText(/Tomasz LIpowiec/)).toBeInTheDocument();
    expect(screen.getByText(/Deniss Patancevs/)).toBeInTheDocument();
    expect(screen.getByText(/Kathering Rivera/)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Tomasz LIpowiec/ })).toHaveAttribute(
      'href',
      'https://github.com/lipowiectomasz',
    );
    expect(screen.getByRole('link', { name: /Deniss Patancevs/ })).toHaveAttribute(
      'href',
      'https://github.com/deepcd87',
    );
    expect(screen.getByRole('link', { name: /Kathering Rivera/ })).toHaveAttribute(
      'href',
      'https://github.com/kattrr',
    );
  });

  it('displays the current year and translated text', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} All rights reserved.`)).toBeInTheDocument();
  });

  it('renders RS School logo with correct link', () => {
    render(<Footer />);
    const logoLink = screen.getByRole('link', { name: /RS School ReactJS/ });
    expect(logoLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    const logoImage = screen.getByAltText(/RS School ReactJS/);
    expect(logoImage).toBeInTheDocument();
  });
});

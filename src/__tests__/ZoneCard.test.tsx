import { render, screen, fireEvent } from '@testing-library/react';
import ZoneCard from '../components/ZoneCard';
import { describe, it, expect, vi } from 'vitest';

describe('ZoneCard', () => {
  const mockProps = {
    id: 'gate_a',
    name: 'North Gate',
    type: 'gate',
    capacity: 85,
    waitTime: 15,
    onNavigate: vi.fn()
  };

  it('formats wait time correctly', () => {
    render(<ZoneCard {...mockProps} />);
    expect(screen.getByTestId('wait-time')).toHaveTextContent('15 min');
  });

  it('shows correct crowd status color', () => {
    render(<ZoneCard {...mockProps} />);
    const badge = screen.getByTestId('crowd-status-badge');
    expect(badge).toHaveTextContent('high');
    expect(badge).toHaveClass('text-danger');
  });

  it('navigation button is accessible', () => {
    render(<ZoneCard {...mockProps} />);
    const navBtn = screen.getByLabelText(/Navigate to North Gate/i);
    expect(navBtn).toBeInTheDocument();
    
    fireEvent.click(navBtn);
    expect(mockProps.onNavigate).toHaveBeenCalledWith('gate_a');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import StadiumHeatmap from '../components/StadiumHeatmap';
import { useVenueData } from '../hooks/useVenueData';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock the hook
vi.mock('../hooks/useVenueData');

const mockZones = {
  section_a: { name: 'Section A', type: 'seat', capacity: 20, waitTime: 0, isOpen: true, crowdLevel: 'low' },
  section_b: { name: 'Section B', type: 'seat', capacity: 55, waitTime: 0, isOpen: true, crowdLevel: 'medium' },
  section_c: { name: 'Section C', type: 'seat', capacity: 90, waitTime: 0, isOpen: true, crowdLevel: 'high' }
};

describe('StadiumHeatmap', () => {
  it('renders loading state', () => {
    (useVenueData as any).mockReturnValue({ zones: null, loading: true });
    render(<StadiumHeatmap />, { wrapper: BrowserRouter });
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('renders zones with correct colors based on capacity', () => {
    (useVenueData as any).mockReturnValue({ zones: mockZones, loading: false });
    render(<StadiumHeatmap />, { wrapper: BrowserRouter });
    
    const sectionA = screen.getByRole('button', { name: /Section A/i });
    const sectionB = screen.getByRole('button', { name: /Section B/i });
    const sectionC = screen.getByRole('button', { name: /Section C/i });

    expect(sectionA.querySelector('.zone')).toHaveAttribute('fill', '#22C55E');
    expect(sectionB.querySelector('.zone')).toHaveAttribute('fill', '#F59E0B');
    expect(sectionC.querySelector('.zone')).toHaveAttribute('fill', '#EF4444');
  });

  it('shows popup when a zone is clicked', () => {
    (useVenueData as any).mockReturnValue({ zones: mockZones, loading: false });
    render(<StadiumHeatmap />, { wrapper: BrowserRouter });
    
    const sectionA = screen.getByRole('button', { name: /Section A: 20 percent/i });
    fireEvent.click(sectionA);
    
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});

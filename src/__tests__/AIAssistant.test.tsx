import { render, screen, fireEvent } from '@testing-library/react';
import Assistant from '../pages/Assistant';
import { useVenueData } from '../hooks/useVenueData';
import { askGemini } from '../services/geminiService';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../hooks/useVenueData');
vi.mock('../services/geminiService');

const mockZones = {
  gate_north: { name: 'North Gate', capacity: 45, waitTime: 8, type: 'gate', isOpen: true, crowdLevel: 'medium' }
};

describe('AIAssistant', () => {
  it('renders chat input and suggestions', () => {
    (useVenueData as any).mockReturnValue({ zones: mockZones, loading: false });
    render(<Assistant />);
    
    expect(screen.getByPlaceholderText(/Ask about crowds/i)).toBeInTheDocument();
    expect(screen.getByText('🚪 Best entry gate?')).toBeInTheDocument();
  });

  it('shows typing indicators when sending a message', async () => {
    (useVenueData as any).mockReturnValue({ zones: mockZones, loading: false });
    (askGemini as any).mockResolvedValue("Mock AI Response");
    
    render(<Assistant />);
    const input = screen.getByPlaceholderText(/Ask about crowds/i);
    const sendBtn = screen.getByLabelText(/Send message/i);
    
    fireEvent.change(input, { target: { value: 'How is the crowd?' } });
    fireEvent.click(sendBtn);
    
    expect(screen.getByRole('status', { name: /AI is thinking/i })).toBeInTheDocument();
  });

  it('shows error message if API fails', async () => {
    (useVenueData as any).mockReturnValue({ zones: mockZones, loading: false });
    (askGemini as any).mockRejectedValue(new Error("API Error"));
    
    render(<Assistant />);
    const input = screen.getByPlaceholderText(/Ask about crowds/i);
    fireEvent.change(input, { target: { value: 'Test error' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    const errors = await screen.findAllByText(/API Error/i);
    expect(errors.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from '../components/chat/ChatPanel';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message with the correct role', () => {
    render(<ChatPanel userRole="Fan" />);
    expect(screen.getByText(/Hello! I am Movra/i)).toBeTruthy();
    expect(screen.getByText(/Fan/)).toBeTruthy();
  });

  it('renders the chat input field', () => {
    render(<ChatPanel userRole="Organizer" />);
    const input = screen.getByLabelText(/Chat input/i);
    expect(input).toBeTruthy();
  });

  it('renders the send button', () => {
    render(<ChatPanel userRole="Fan" />);
    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toBeTruthy();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatPanel userRole="Fan" />);
    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toHaveProperty('disabled', true);
  });

  it('enables send button when input has text', () => {
    render(<ChatPanel userRole="Fan" />);
    const input = screen.getByLabelText(/Chat input/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toHaveProperty('disabled', false);
  });

  it('renders clear chat button', () => {
    render(<ChatPanel userRole="Fan" />);
    const clearButton = screen.getByLabelText(/Clear chat/i);
    expect(clearButton).toBeTruthy();
  });

  it('renders language selector', () => {
    render(<ChatPanel userRole="Fan" />);
    const selector = screen.getByLabelText(/Select response language/i);
    expect(selector).toBeTruthy();
  });

  it('adds user message to chat on form submit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Gate A is straight ahead!', role: 'Fan' }),
    });

    render(<ChatPanel userRole="Fan" />);
    const input = screen.getByLabelText(/Chat input/i);
    fireEvent.change(input, { target: { value: 'Where is Gate A?' } });
    fireEvent.submit(input.closest('form')!);

    // User message should appear
    await waitFor(() => {
      expect(screen.getByText('Where is Gate A?')).toBeTruthy();
    });
  });

  it('displays AI response after successful API call', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Gate A is on the north side.', role: 'Fan' }),
    });

    render(<ChatPanel userRole="Fan" />);
    const input = screen.getByLabelText(/Chat input/i);
    fireEvent.change(input, { target: { value: 'Where is Gate A?' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Gate A is on the north side.')).toBeTruthy();
    });
  });

  it('displays error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limited' }),
    });

    render(<ChatPanel userRole="Fan" />);
    const input = screen.getByLabelText(/Chat input/i);
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Rate limited')).toBeTruthy();
    });
  });

  it('clears chat when clear button is clicked', () => {
    render(<ChatPanel userRole="Fan" />);
    const clearButton = screen.getByLabelText(/Clear chat/i);
    fireEvent.click(clearButton);

    // Should still have the welcome message
    expect(screen.getByText(/Hello! I am Movra/i)).toBeTruthy();
  });

  it('has accessible chat log region', () => {
    render(<ChatPanel userRole="Fan" />);
    const chatLog = screen.getByRole('log');
    expect(chatLog).toBeTruthy();
    expect(chatLog.getAttribute('aria-live')).toBe('polite');
  });
});

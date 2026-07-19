import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccessPanel from '../components/accessibility/AccessPanel';

describe('AccessPanel', () => {
  it('renders the Accessibility Services heading', () => {
    render(<AccessPanel />);
    expect(screen.getByText('Accessibility Services')).toBeTruthy();
  });

  it('renders all four accessibility services', () => {
    render(<AccessPanel />);
    expect(screen.getByText('Wheelchair Route')).toBeTruthy();
    expect(screen.getByText('Sensory Room')).toBeTruthy();
    expect(screen.getByText('Audio Description')).toBeTruthy();
    expect(screen.getByText('Large Print Menus')).toBeTruthy();
  });

  it('displays correct locations for each service', () => {
    render(<AccessPanel />);
    expect(screen.getByText('Gate B to Sec 104')).toBeTruthy();
    expect(screen.getByText('Level 2, Room 205')).toBeTruthy();
    expect(screen.getByText('Tune to FM 104.5')).toBeTruthy();
    expect(screen.getByText('All Concessions')).toBeTruthy();
  });

  it('displays correct status badges', () => {
    render(<AccessPanel />);
    expect(screen.getByText('Clear')).toBeTruthy();
    expect(screen.getAllByText('Available')).toHaveLength(2);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('has an accessible list structure', () => {
    render(<AccessPanel />);
    const list = screen.getByRole('list', { name: /accessibility services/i });
    expect(list).toBeTruthy();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
  });
});

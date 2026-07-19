import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CrowdHeatmap from '../components/crowd/CrowdHeatmap';
import TransportPanel from '../components/transport/TransportPanel';
import EcoTracker from '../components/sustainability/EcoTracker';
import StadiumMap from '../components/navigation/StadiumMap';
import OperationalKPIs from '../components/dashboard/OperationalKPIs';

describe('CrowdHeatmap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    if (typeof window !== 'undefined') {
      window.movraVenueState = {};
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with initial zones', () => {
    render(<CrowdHeatmap />);
    expect(screen.getByText('Crowd Density')).toBeTruthy();
    expect(screen.getByText('Gate A (North)')).toBeTruthy();
    expect(screen.getByText('Food Court 1')).toBeTruthy();
  });

  it('periodically updates densities and publishes to global window state', () => {
    render(<CrowdHeatmap />);

    // Advancing timers by 3000ms triggers updateZones
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Check that values are published to window.movraVenueState
    expect(window.movraVenueState?.crowd).toBeDefined();
    expect(window.movraVenueState!.crowd!.length).toBe(5);
    expect(window.movraVenueState!.crowd![0].density).toBeGreaterThanOrEqual(0);
    expect(window.movraVenueState!.crowd![0].density).toBeLessThanOrEqual(100);
  });
});

describe('TransportPanel', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.movraVenueState = {};
    }
  });

  it('renders correctly with options', () => {
    render(<TransportPanel />);
    expect(screen.getByText('Transit Hub')).toBeTruthy();
    expect(screen.getByText('Metro Red Line')).toBeTruthy();
    expect(screen.getByText('Stadium Express Bus')).toBeTruthy();
    expect(screen.getByText('Rideshare Zone C')).toBeTruthy();
  });

  it('publishes transit options to global window state on mount', () => {
    render(<TransportPanel />);
    expect(window.movraVenueState?.transit).toBeDefined();
    expect(window.movraVenueState!.transit!.length).toBe(3);
    expect(window.movraVenueState!.transit![0].name).toBe('Metro Red Line');
  });
});

describe('EcoTracker', () => {
  it('renders matchday footprint and offset tip', () => {
    render(<EcoTracker />);
    expect(screen.getByText('Eco Tracker')).toBeTruthy();
    expect(screen.getByText('12.5')).toBeTruthy();
    expect(screen.getByText('Offset by choosing public transit!')).toBeTruthy();
  });

  it('renders recycling and water stations', () => {
    render(<EcoTracker />);
    expect(screen.getByText('Water Station')).toBeTruthy();
    expect(screen.getByText('Recycling Bin')).toBeTruthy();
  });
});

describe('StadiumMap', () => {
  it('renders interactive map heading and legend', () => {
    render(<StadiumMap />);
    expect(screen.getByText('Interactive Map')).toBeTruthy();
    expect(screen.getAllByText('Field').length).toBeGreaterThan(0);
    expect(screen.getByText('Seating')).toBeTruthy();
  });

  it('renders initial detail panel instruction', () => {
    render(<StadiumMap />);
    expect(screen.getByText('Select a zone on the map for details')).toBeTruthy();
  });
});

describe('OperationalKPIs', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      window.movraVenueState = {};
    }
  });

  it('renders correctly for Organizer role and publishes operations data', () => {
    render(<OperationalKPIs role="Organizer" />);
    expect(screen.getByText('Avg Gate Flow')).toBeTruthy();
    expect(screen.getByText('1,240/hr')).toBeTruthy();
    expect(screen.getByText('Total Attendance')).toBeTruthy();
    expect(screen.getByText('67,320')).toBeTruthy();
    
    expect(window.movraVenueState?.operations).toBeDefined();
    expect(window.movraVenueState!.operations!.attendance).toBe('67,320');
  });

  it('renders correctly for Staff role and publishes operations data', () => {
    render(<OperationalKPIs role="Staff" />);
    expect(screen.getByText('Active Incidents')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Time to Kickoff')).toBeTruthy();
    expect(screen.getByText('45 min')).toBeTruthy();
  });

  it('returns null for non-Ops roles like Fan or Volunteer', () => {
    const { container } = render(<OperationalKPIs role="Fan" />);
    expect(container.firstChild).toBeNull();
  });
});

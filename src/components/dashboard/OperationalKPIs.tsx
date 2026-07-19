'use client';

import React, { useEffect } from 'react';
import { Activity, Users, AlertTriangle, Clock } from 'lucide-react';
import type { Role } from '@/lib/types';

interface OperationalKPIsProps {
  role: Role;
}

/**
 * Operational Intelligence KPI bar displayed for Organizer and Staff roles.
 * Renders key real-time metrics and publishes them to the global window state.
 */
export default function OperationalKPIs({ role }: OperationalKPIsProps) {
  useEffect(() => {
    if (role !== 'Organizer' && role !== 'Staff') return;
    if (typeof window !== 'undefined') {
      if (!window.movraVenueState) window.movraVenueState = {};
      window.movraVenueState.operations = {
        attendance: '67,320',
        incidents: [
          '1. East Concourse spill (cleanup dispatched)',
          '2. Gate B ticket scanner failure (technician responding)',
          '3. West Concourse minor medical assistance (resolved)',
        ],
        gateFlow: '1,240/hr',
        timeToKickoff: '45 min',
      };
    }

    return () => {
      if (typeof window !== 'undefined' && window.movraVenueState) {
        delete window.movraVenueState.operations;
      }
    };
  }, [role]);

  if (role !== 'Organizer' && role !== 'Staff') return null;

  const kpis = [
    {
      label: 'Avg Gate Flow',
      value: '1,240/hr',
      icon: <Activity size={14} aria-hidden="true" />,
      color: 'text-link',
    },
    {
      label: 'Total Attendance',
      value: '67,320',
      icon: <Users size={14} aria-hidden="true" />,
      color: 'text-cyan',
    },
    {
      label: 'Active Incidents',
      value: '3',
      icon: <AlertTriangle size={14} aria-hidden="true" />,
      color: 'text-warning-deep',
    },
    {
      label: 'Time to Kickoff',
      value: '45 min',
      icon: <Clock size={14} aria-hidden="true" />,
      color: 'text-violet',
    },
  ];

  return (
    <div
      className="w-full border-b border-hairline bg-canvas px-6 py-3"
      role="region"
      aria-label="Operational intelligence metrics"
    >
      <div className="max-w-[1400px] mx-auto flex items-center gap-6 overflow-x-auto">
        <span className="text-caption-mono text-mute whitespace-nowrap">OPS INTEL</span>
        <div className="flex items-center gap-4 md:gap-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className={kpi.color}>{kpi.icon}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-body-sm-strong text-ink">{kpi.value}</span>
                <span className="text-caption text-mute">{kpi.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

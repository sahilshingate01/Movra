'use client';

import React, { useState } from 'react';
import { Leaf, Droplets, Recycle } from 'lucide-react';

export default function EcoTracker() {
  const [footprint] = useState(12.5); // kg CO2

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Leaf size={18} className="text-cyan" />
          Eco Tracker
        </h3>
      </div>

      <div className="p-4 bg-canvas-soft border border-hairline rounded-md mb-4 text-center">
        <p className="text-caption-mono text-body uppercase mb-1">Your Matchday Footprint</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-display-lg text-cyan">{footprint}</span>
          <span className="text-body-sm text-body">kg CO₂</span>
        </div>
        <p className="text-caption text-body mt-2">Offset by choosing public transit!</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-canvas-soft border border-hairline rounded-md flex flex-col items-center text-center gap-2">
          <Droplets size={20} className="text-link" />
          <div>
            <p className="text-caption font-medium text-ink">Water Station</p>
            <p className="text-caption text-body">Section 112 • 50m</p>
          </div>
        </div>
        <div className="p-3 bg-canvas-soft border border-hairline rounded-md flex flex-col items-center text-center gap-2">
          <Recycle size={20} className="text-cyan" />
          <div>
            <p className="text-caption font-medium text-ink">Recycling Bin</p>
            <p className="text-caption text-body">Gate A • 20m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

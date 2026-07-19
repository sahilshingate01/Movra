import { redirect } from 'next/navigation';
import type { Role } from '@/lib/types';
import { VALID_ROLES } from '@/lib/constants';
import ChatPanel from '@/components/chat/ChatPanel';
import StadiumMap from '@/components/navigation/StadiumMap';
import CrowdHeatmap from '@/components/crowd/CrowdHeatmap';
import TransportPanel from '@/components/transport/TransportPanel';
import EcoTracker from '@/components/sustainability/EcoTracker';
import AccessPanel from '@/components/accessibility/AccessPanel';
import Link from 'next/link';
import { Activity, Users, AlertTriangle, Clock } from 'lucide-react';

/**
 * Operational Intelligence KPI bar displayed for Organizer and Staff roles.
 * Shows real-time metrics for decision support.
 */
function OperationalKPIs({ role }: { role: Role }) {
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const roleStr = resolvedSearchParams.role as string;

  if (!roleStr || !(VALID_ROLES as readonly string[]).includes(roleStr)) {
    redirect('/');
  }

  const role = roleStr as Role;

  return (
    <div className="flex flex-col min-h-screen bg-canvas-soft text-ink font-sans selection:bg-primary selection:text-on-primary">
      {/* Top Nav-Bar */}
      <nav
        className="h-[64px] border-b border-hairline bg-canvas px-6 flex items-center justify-between sticky top-0 z-50"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl text-ink tracking-tight flex items-center gap-2"
            aria-label="Movra — return to home"
          >
            <span className="w-6 h-6 bg-primary rounded-full" aria-hidden="true" />
            Movra
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">
              Matches
            </span>
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">
              Intelligence
            </span>
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">
              Support
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-caption-mono text-body border border-hairline px-3 py-1 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-cyan" aria-hidden="true" />
            ROLE: {role.toUpperCase()}
          </div>
          <button className="bg-primary text-on-primary text-body-sm-strong px-2 h-[28px] rounded-sm hover:opacity-90 transition-opacity">
            Ask AI
          </button>
        </div>
      </nav>

      {/* Operational Intelligence KPI Bar (Organizer & Staff only) */}
      <OperationalKPIs role={role} />

      {/* Main Dashboard Surface */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column: AI Assistant (Movra) */}
        <section
          className="lg:col-span-7 flex flex-col h-[calc(100vh-120px)] bg-canvas border border-hairline rounded-md shadow-level-2 overflow-hidden"
          aria-label="AI chat assistant"
        >
          <header className="h-[48px] border-b border-hairline flex items-center px-4 bg-canvas-soft-2">
            <h2 className="text-caption-mono text-ink font-medium">
              movra-terminal ~ /chat/{role.toLowerCase()}
            </h2>
          </header>
          <div className="flex-1 overflow-hidden">
            <ChatPanel userRole={role} />
          </div>
        </section>

        {/* Right Column: Venue Intelligence Widgets */}
        <aside
          className="lg:col-span-5 flex flex-col h-[calc(100vh-120px)] overflow-y-auto space-y-4 pb-8 pr-2 custom-scrollbar"
          aria-label="Venue intelligence panels"
        >
          <div className="text-caption-mono text-body mb-2 sticky top-0 bg-canvas-soft z-10 py-2">
            VENUE INTELLIGENCE
          </div>

          {/* Conditionally render panels based on role */}
          {role === 'Fan' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <StadiumMap />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <TransportPanel />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <EcoTracker />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <AccessPanel />
              </div>
            </>
          )}

          {role === 'Organizer' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <CrowdHeatmap />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <StadiumMap />
              </div>
            </>
          )}

          {role === 'Volunteer' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <StadiumMap />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <AccessPanel />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <CrowdHeatmap />
              </div>
            </>
          )}

          {role === 'Staff' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <CrowdHeatmap />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <StadiumMap />
              </div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden">
                <TransportPanel />
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

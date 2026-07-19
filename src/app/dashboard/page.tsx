import { redirect } from 'next/navigation';
import { Role } from '@/lib/prompts';
import ChatPanel from '@/components/chat/ChatPanel';
import StadiumMap from '@/components/navigation/StadiumMap';
import CrowdHeatmap from '@/components/crowd/CrowdHeatmap';
import TransportPanel from '@/components/transport/TransportPanel';
import EcoTracker from '@/components/sustainability/EcoTracker';
import AccessPanel from '@/components/accessibility/AccessPanel';
import Link from 'next/link';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const roleStr = resolvedSearchParams.role as string;
  
  if (!roleStr || !['Fan', 'Organizer', 'Volunteer', 'Staff'].includes(roleStr)) {
    redirect('/');
  }

  const role = roleStr as Role;

  return (
    <div className="flex flex-col min-h-screen bg-canvas-soft text-ink font-sans selection:bg-primary selection:text-on-primary">
      {/* Top Nav-Bar */}
      <nav className="h-[64px] border-b border-hairline bg-canvas px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-ink tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 bg-primary rounded-full" />
            Movra
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">Matches</span>
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">Intelligence</span>
            <span className="text-body-sm text-body px-3 py-2 rounded-full hover:bg-canvas-soft-2 transition-colors cursor-pointer">Support</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-caption-mono text-body border border-hairline px-3 py-1 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-cyan" />
            ROLE: {role.toUpperCase()}
          </div>
          <button className="bg-primary text-on-primary text-body-sm-strong px-2 h-[28px] rounded-sm hover:opacity-90 transition-opacity">
            Ask AI
          </button>
        </div>
      </nav>

      {/* Main Dashboard Surface */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Assistant (Movra) */}
        <section className="lg:col-span-7 flex flex-col h-[calc(100vh-120px)] bg-canvas border border-hairline rounded-md shadow-level-2 overflow-hidden">
          <header className="h-[48px] border-b border-hairline flex items-center px-4 bg-canvas-soft-2">
            <h2 className="text-caption-mono text-ink font-medium">movra-terminal ~ /chat/{role.toLowerCase()}</h2>
          </header>
          <div className="flex-1 overflow-hidden">
            <ChatPanel userRole={role} />
          </div>
        </section>

        {/* Right Column: Venue Intelligence Widgets */}
        <aside className="lg:col-span-5 flex flex-col h-[calc(100vh-120px)] overflow-y-auto space-y-4 pb-8 pr-2 custom-scrollbar">
          <div className="text-caption-mono text-body mb-2 sticky top-0 bg-canvas-soft z-10 py-2">
            VENUE INTELLIGENCE
          </div>

          {/* Conditionally render panels based on role */}
          {role === 'Fan' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><StadiumMap /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><TransportPanel /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><EcoTracker /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><AccessPanel /></div>
            </>
          )}

          {role === 'Organizer' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><CrowdHeatmap /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><StadiumMap /></div>
            </>
          )}

          {role === 'Volunteer' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><StadiumMap /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><AccessPanel /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><CrowdHeatmap /></div>
            </>
          )}

          {role === 'Staff' && (
            <>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><CrowdHeatmap /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><StadiumMap /></div>
              <div className="bg-canvas border border-hairline rounded-md shadow-level-1 overflow-hidden"><TransportPanel /></div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

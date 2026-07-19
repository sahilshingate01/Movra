import Link from 'next/link';
import { ShieldAlert, Users, Ticket, Wrench } from 'lucide-react';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-canvas-soft text-ink flex flex-col relative overflow-hidden font-sans selection:bg-primary selection:text-on-primary">
      {/* 
        Mesh Gradient Backdrop
        Uses the 4 specific Vercel gradient stops: cyan, highlight-pink, violet, warning (amber)
        The backdrop floats at the top half of the page.
      */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] opacity-[0.15] mix-blend-multiply blur-[100px] rounded-full"
             style={{
               background: 'radial-gradient(circle at 30% 30%, var(--color-cyan) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--color-highlight-pink) 0%, transparent 50%), radial-gradient(circle at 50% 60%, var(--color-violet) 0%, transparent 50%), radial-gradient(circle at 30% 70%, var(--color-warning) 0%, transparent 50%)'
             }}
        />
      </div>

      <div className="z-10 w-full max-w-[1400px] mx-auto px-6 py-48 flex flex-col items-center text-center">
        <div className="bg-canvas border border-hairline px-3 py-1 rounded-full text-caption-mono text-body mb-8 shadow-level-1">
          FIFA WORLD CUP 2026
        </div>
        
        <h1 className="text-display-xl max-w-4xl text-ink">
          Build and deploy the ultimate stadium experience.
        </h1>
        
        <p className="text-body-lg text-body max-w-2xl mt-6">
          Movra is the AI-native intelligence layer for matchday operations. 
          Select your persona to access tailored venue analytics, crowd management, and fan wayfinding.
        </p>

        {/* Roles Grid (card-marketing pattern) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 w-full">
          
          {/* Fan */}
          <Link href="/dashboard?role=Fan" 
            className="group flex flex-col items-start text-left bg-canvas border border-hairline p-6 rounded-md shadow-level-1 hover:shadow-level-3 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center mb-6 text-ink bg-canvas-soft group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">
              <Ticket size={20} />
            </div>
            <h2 className="text-display-sm text-ink mb-2">Fan</h2>
            <p className="text-body-sm text-body mb-6 flex-1">Navigate the venue, find food, and get real-time match info.</p>
            <div className="text-button-md text-ink group-hover:text-link flex items-center gap-2 transition-colors">
              Enter as Fan &rarr;
            </div>
          </Link>

          {/* Organizer */}
          <Link href="/dashboard?role=Organizer" 
            className="group flex flex-col items-start text-left bg-canvas border border-hairline p-6 rounded-md shadow-level-1 hover:shadow-level-3 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center mb-6 text-ink bg-canvas-soft group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">
              <Users size={20} />
            </div>
            <h2 className="text-display-sm text-ink mb-2">Organizer</h2>
            <p className="text-body-sm text-body mb-6 flex-1">Monitor crowd density, gate flow, and high-level operations.</p>
            <div className="text-button-md text-ink group-hover:text-link flex items-center gap-2 transition-colors">
              Enter as Organizer &rarr;
            </div>
          </Link>

          {/* Volunteer */}
          <Link href="/dashboard?role=Volunteer" 
            className="group flex flex-col items-start text-left bg-canvas border border-hairline p-6 rounded-md shadow-level-1 hover:shadow-level-3 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center mb-6 text-ink bg-canvas-soft group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">
              <ShieldAlert size={20} />
            </div>
            <h2 className="text-display-sm text-ink mb-2">Volunteer</h2>
            <p className="text-body-sm text-body mb-6 flex-1">Assist fans, coordinate tasks, and answer FAQs.</p>
            <div className="text-button-md text-ink group-hover:text-link flex items-center gap-2 transition-colors">
              Enter as Volunteer &rarr;
            </div>
          </Link>

          {/* Staff */}
          <Link href="/dashboard?role=Staff" 
            className="group flex flex-col items-start text-left bg-canvas border border-hairline p-6 rounded-md shadow-level-1 hover:shadow-level-3 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center mb-6 text-ink bg-canvas-soft group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">
              <Wrench size={20} />
            </div>
            <h2 className="text-display-sm text-ink mb-2">Venue Staff</h2>
            <p className="text-body-sm text-body mb-6 flex-1">Respond to incidents, manage vendors, and ensure safety.</p>
            <div className="text-button-md text-ink group-hover:text-link flex items-center gap-2 transition-colors">
              Enter as Staff &rarr;
            </div>
          </Link>

        </div>
      </div>
      
      {/* Footer Band */}
      <footer className="mt-auto w-full border-t border-hairline bg-canvas py-16 px-6">
        <div className="max-w-[1400px] mx-auto text-caption text-body flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Movra © 2026. A Vercel-inspired stadium intelligence platform.</p>
          <div className="flex gap-4">
            <span className="hover:text-ink cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-ink cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-ink cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
        <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-indigo-400" />
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Workflow Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                            Viewer Mode
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>
    </div>
  );
}

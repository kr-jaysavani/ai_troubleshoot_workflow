'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [workflowId, setWorkflowId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (workflowId.trim()) {
      router.push(`/workflow/${workflowId}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg px-6 text-center space-y-8">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-400 text-xs font-medium uppercase tracking-wider mb-4">
                    <Activity className="w-3 h-3" />
                    Router Diagnostics v2.0
                </div>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
                    Troubleshoot.
                </h1>
                <p className="text-lg text-neutral-400">
                    AI-powered diagnostic workflows for your hardware issues.
                </p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-2 flex items-center shadow-2xl">
                    <Search className="w-5 h-5 text-neutral-500 ml-3" />
                    <input 
                        type="text" 
                        value={workflowId}
                        onChange={(e) => setWorkflowId(e.target.value)}
                        placeholder="Enter Workflow ID..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 px-4 py-2"
                    />
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        Start <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>

            <div className="pt-8 border-t border-neutral-800/50 flex items-center justify-center gap-6 text-sm text-neutral-500">
                <Link href="/admin" className="hover:text-indigo-400 transition-colors flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                </Link>
            </div>
        </div>
    </div>
  );
}

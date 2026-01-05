'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowRight, Loader2, GitGraph } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  _count: {
    nodes: number;
  };
}

export default function AdminDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (error) {
      console.error('Failed to load workflows', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Workflow',
          description: 'Draft troubleshooting workflow',
        }),
      });

      if (res.ok) {
        const newWorkflow = await res.json();
        router.push(`/admin/workflow/${newWorkflow.id}`);
      }
    } catch (error) {
      console.error('Failed to create workflow', error);
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      setWorkflows(workflows.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workflow', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflows</h1>
          <p className="text-neutral-400 mt-2">Manage your troubleshooting diagrams</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
          <GitGraph className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No workflows yet</h3>
          <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
            Get started by creating your first troubleshooting logic flow.
          </p>
          <button
            onClick={handleCreate}
            className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium text-sm"
          >
            Create one now &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <Link
              key={workflow.id}
              href={`/admin/workflow/${workflow.id}`}
              className="group relative block p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDelete(e, workflow.id)}
                  className="p-2 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors pr-8">
                {workflow.name}
              </h3>
              <p className="text-sm text-neutral-400 mt-1 line-clamp-2 min-h-[2.5em]">
                {workflow.description || 'No description'}
              </p>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {workflow._count.nodes} Nodes
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-neutral-300 group-hover:translate-x-1 transition-transform">
                  Edit <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

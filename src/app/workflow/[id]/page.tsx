'use client';

import { use, useState, useEffect } from 'react';
import WorkflowRunner from '@/components/runner/WorkflowRunner';
import { Loader2 } from 'lucide-react';

export default function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      const res = await fetch(`/api/workflows/${id}`);
      if (!res.ok) throw new Error('Workflow not found');
      const data = await res.json();
      setWorkflow(data);
    } catch (error) {
      console.error(error);
      setError('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
     );
  }

  if (error || !workflow) {
      return (
          <div className="flex h-screen items-center justify-center bg-black text-white">
              <p className="text-red-500">{error || 'Workflow not found'}</p>
          </div>
      );
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden mobile-screen-simulation">
      <WorkflowRunner workflow={workflow} />
    </div>
  );
}

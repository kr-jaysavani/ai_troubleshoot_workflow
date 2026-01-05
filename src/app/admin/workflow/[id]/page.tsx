'use client';

import { use, useState, useEffect } from 'react';
import WorkflowEditor from '@/components/admin/WorkflowEditor';
import { Loader2 } from 'lucide-react';

export default function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      const res = await fetch(`/api/workflows/${id}`);
      if (res.ok) {
        const data = await res.json();
        setWorkflow(data);
      }
    } catch (error) {
      console.error('Failed to load workflow', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
     );
  }

  if (!workflow) return <div>Workflow not found</div>;

  return (
    <div className="h-[calc(100vh-64px)] -mx-4 -my-8 sm:-mx-6 lg:-mx-8">
      <WorkflowEditor initialWorkflow={workflow} />
    </div>
  );
}

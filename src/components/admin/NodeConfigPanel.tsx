'use client';

// Define the shape of our configs
type NodeConfig = any;

import { X, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NodeConfigPanel({ 
    node, 
    onChange,
    onDelete,
    onClose 
}: { 
    node: any; 
    onChange: (config: NodeConfig) => void;
    onDelete: () => void;
    onClose: () => void;
}) {
  const [config, setConfig] = useState(node.data.config || {});
  
  // Update local state when selected node changes
  useEffect(() => {
    setConfig(node.data.config || {});
  }, [node.id, node.data.config]);

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onChange(newConfig);
  };

  const type = node.data.type;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
            <h3 className="font-semibold text-white">{type.replace('_', ' ')}</h3>
            <p className="text-xs text-neutral-500 font-mono">{node.id.slice(0, 8)}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded text-neutral-400">
            <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Common: Title */}
        {(type === 'WELCOME' || type === 'INSTRUCTION' || type === 'IMAGE_CAPTURE') && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">Title</label>
                <input
                    type="text"
                    value={config.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Page Title"
                />
            </div>
        )}

        {/* Common: Description */}
        {(type === 'WELCOME' || type === 'INSTRUCTION') && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">Description</label>
                <textarea
                    value={config.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                    placeholder="Detailed instructions..."
                />
            </div>
        )}

        {/* Common: Image URL */}
        {(type === 'WELCOME' || type === 'INSTRUCTION' || type === 'IMAGE_CAPTURE') && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">Image URL (Optional)</label>
                <input
                    type="text"
                    value={config.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://..."
                />
            </div>
        )}

        {/* Common: Next Button Text */}
        {(type === 'WELCOME' || type === 'INSTRUCTION' || type === 'IMAGE_CAPTURE') && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">Button Text</label>
                <input
                    type="text"
                    value={config.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Next"
                />
            </div>
        )}

        {/* IMAGE_ANALYSIS specific */}
        {type === 'IMAGE_ANALYSIS' && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">API Endpoint URL</label>
                <input
                    type="text"
                    value={config.apiUrl || ''}
                    onChange={(e) => handleChange('apiUrl', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="https://api.example.com/analyze"
                />
                <p className="text-xs text-neutral-500 mt-1">Leave empty to use mock.</p>
            </div>
        )}

        {/* LOGICAL_NODE specific - Just a placeholder for now, usually needs complex condition builder */}
        {type === 'LOGICAL_NODE' && (
             <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <p className="text-sm text-neutral-400">
                    Logic nodes evaluate the previous step's output to determine the path. Connect edges to different targets to define branches.
                </p>
            </div>
        )}

         {/* AI_NODE specific */}
         {type === 'AI_NODE' && (
            <div className="space-y-1">
                <label className="text-xs text-neutral-400">Prompt / Objective</label>
                <textarea
                    value={config.prompt || ''}
                    onChange={(e) => handleChange('prompt', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                    placeholder="E.g., Determine if power cable is missing..."
                />
            </div>
        )}

      </div>
      
      <div className="pt-4 border-t border-neutral-800">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete Node
          </button>
      </div>
    </div>
  );
}

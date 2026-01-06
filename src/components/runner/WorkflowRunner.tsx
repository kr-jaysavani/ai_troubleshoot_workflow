'use client';

import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Loader2, Camera, ChevronRight, CheckCircle, AlertTriangle, RefreshCcw } from 'lucide-react';

// --- Node Components (Inline for now for speed/integration, will extract if large) ---

function WelcomeNode({ config, onNext }: any) {
    return (
        <div className="flex flex-col h-full p-6 text-center justify-center animate-in fade-in duration-500">
            {config.imageUrl && (
                <img src={config.imageUrl} alt="Welcome" className="w-full h-64 object-cover rounded-2xl mb-8 shadow-2xl shadow-indigo-500/20" />
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                {config.title || 'Welcome'}
            </h1>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                {config.description || 'Let\'s troubleshoot your router.'}
            </p>
            <button
                onClick={onNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {config.buttonText || 'Start'} <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}

function InstructionNode({ config, onNext }: any) {
    return (
        <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
            <div className="flex-1 overflow-y-auto">
                {config.imageUrl && (
                    <img src={config.imageUrl} alt="Instruction" className="w-full h-48 object-cover rounded-xl mb-6" />
                )}
                <h2 className="text-2xl font-bold text-white mb-4">{config.title || 'Instructions'}</h2>
                <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {config.description || 'Please follow the steps...'}
                    </p>
                </div>
            </div>
            <div className="mt-6">
                <button
                    onClick={onNext}
                    className="w-full py-4 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-lg transition-all active:scale-95"
                >
                    {config.buttonText || 'Next'}
                </button>
            </div>
        </div>
    );
}

function ImageCaptureNode({ config, onNext, onCapture }: any) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
        }
    };

    const retake = () => {
        setImgSrc(null);
    };

    const confirm = () => {
        if (imgSrc) {
            onCapture(imgSrc);
            onNext();
        }
    };

    return (
        <div className="flex flex-col h-full bg-black">
            <div className="relative flex-1 bg-neutral-900 overflow-hidden">
                {imgSrc ? (
                    <img src={imgSrc} alt="Captured" className="w-full h-full object-contain" />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: 'environment' }}
                    />
                )}
                
                {/* Overlay Title */}
                <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
                    <h3 className="text-xl font-bold text-white text-center drop-shadow-md">
                        {config.title || 'Capture Image'}
                    </h3>
                </div>
            </div>

            <div className="p-6 bg-neutral-900 pb-8">
                {imgSrc ? (
                     <div className="flex gap-4">
                        <button onClick={retake} className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-medium">
                            Retake
                        </button>
                        <button onClick={confirm} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20">
                            Use Photo
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={capture}
                        className="w-16 h-16 rounded-full bg-white border-4 border-neutral-300 shadow-xl mx-auto block active:scale-90 transition-transform"
                    >
                        <span className="sr-only">Capture</span>
                    </button>
                )}
            </div>
        </div>
    );
}

function AnalysisNode({ config, image, onNext, onAnalysisComplete }: any) {
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        const analyze = async () => {
            try {
                const endpoint = config.apiUrl || '/api/image/analyze';
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inputData: { image:image } }), // In real app, might need FormData or Base64 handling
                });
                const data = await res.json();
                onAnalysisComplete(data);
                
                // Auto proceed after short delay to show success ? or just proceed immediately
                setTimeout(() => onNext(), 1000);
            } catch (e) {
                console.error(e);
                // Handle error
            } finally {
                setAnalyzing(false);
            }
        };

        analyze();
    }, []);

    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Analyzing...</h2>
            <p className="text-neutral-400">identifying components and issues</p>
        </div>
    );
}

function IssueFinderNode({ config, image, analysisResult, onNext }: any) {
    // Overlay analysis boxes
    return (
        <div className="flex flex-col h-full bg-black">
             <div className="relative flex-1 bg-neutral-900 overflow-hidden">
                <img src={image} className="w-full h-full object-contain opacity-50" />
                
                {/* Simplified AR overlay */}
                {analysisResult && Array.isArray(analysisResult) && analysisResult.map((item: any, i: number) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${(item.x / 1000) * 100}%`, // Making assumptions about coord system (fake)
                            top: `${(item.y / 1000) * 100}%`,
                            width: '50px', // simplified
                            height: '50px',
                            border: '2px solid #00ff00',
                            borderRadius: '8px',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500/80 text-black text-[10px] px-1 rounded font-bold">
                            {item.class}
                        </span>
                    </div>
                ))}
            </div>
             <div className="p-6 bg-neutral-900">
                <h3 className="text-lg font-bold text-white mb-2">Analysis Complete</h3>
                <p className="text-neutral-400 text-sm mb-4">We found {analysisResult ? analysisResult.length : 0} items.</p>
                <button onClick={onNext} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">
                    Continue to Diagnosis
                </button>
            </div>
        </div>
    );
}

function AiNode({ config, analysisResult, onNext }: any) {
   // Mock AI Diagnosis
   const issue = analysisResult?.some((a:any) => a.class === 'power_cable') 
        ? "Power cable detection inconclusive." 
        : "Power cable appears disconnected.";

   return (
       <div className="flex flex-col h-full p-6 items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AI Diagnosis</h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xs">{issue}</p>
            <button onClick={onNext} className="w-full py-4 bg-white text-black rounded-xl font-bold">
                Proceed
            </button>
       </div>
   );
}


export default function WorkflowRunner({ workflow }: { workflow: any }) {
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [variables, setVariables] = useState<any>({}); // store 'image', 'analysisResult', 'aiResult'

    // Init: Find start node
    useEffect(() => {
        if (workflow && !currentNodeId) {
            // Find finding node with no incoming edges or just the first created
            // Better: Find node where no edge.targetId === node.id
            const targetIds = new Set(workflow.edges.map((e: any) => e.targetId));
            const startNode = workflow.nodes.find((n: any) => !targetIds.has(n.id)) || workflow.nodes[0];
            if (startNode) setCurrentNodeId(startNode.id);
        }
    }, [workflow]);

    const handleNext = () => {
        // Logic to find next node
        // Simple 1-1 connection first
        const outgoingEdge = workflow.edges.find((e: any) => e.sourceId === currentNodeId);
        if (outgoingEdge) {
            setHistory(prev => [...prev, currentNodeId!]);
            setCurrentNodeId(outgoingEdge.targetId);
        } else {
            alert("End of workflow");
        }
    };

    const handleDataUpdate = (key: string, value: any) => {
        setVariables((prev: any) => ({ ...prev, [key]: value }));
    };

    if (!currentNodeId) return null;

    const currentNode = workflow.nodes.find((n: any) => n.id === currentNodeId);
    if (!currentNode) return <div>Node missing</div>;

    const type = currentNode.type;
    const config = currentNode.config;

    return (
        <div className="h-full max-w-md mx-auto bg-neutral-950 shadow-2xl relative">
            {/* Render Node based on type */}
            {type === 'WELCOME' && <WelcomeNode config={config} onNext={handleNext} />}
            {type === 'INSTRUCTION' && <InstructionNode config={config} onNext={handleNext} />}
            {type === 'IMAGE_CAPTURE' && <ImageCaptureNode config={config} onNext={handleNext} onCapture={(img: string) => handleDataUpdate('image', img)} />}
            {type === 'IMAGE_ANALYSIS' && <AnalysisNode config={config} image={variables.image} onNext={handleNext} onAnalysisComplete={(res: any) => handleDataUpdate('analysisResult', res)} />}
            {type === 'ISSUE_FINDER' && <IssueFinderNode config={config} image={variables.image} analysisResult={variables.analysisResult} onNext={handleNext} />}
            {type === 'AI_NODE' && <AiNode config={config} analysisResult={variables.analysisResult} onNext={handleNext} />}
            {type === 'LOGICAL_NODE' && (
                <div className="p-6">
                    <p>Logic Node: Processing...</p>
                    <button onClick={handleNext}>Simulate Next</button>
                    {/* In real app, this would auto-evaluate variables and call handleNext(targetId) immediately */}
                </div>
            )}
        </div>
    );
}

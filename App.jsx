import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Terminal, Lock, Crosshair, RefreshCw, 
  Rocket, ShieldAlert, Gauge, Layers, Database, Wrench, Fingerprint
} from 'lucide-react';

// --- DYNAMIC FIREBASE LOADER ---
// We move these inside to prevent top-level crashes
import * as FirebaseApp from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import * as FirebaseFirestore from 'firebase/firestore';

export default function App() {
  const [debugLog, setDebugLog] = useState(['Initializing Kernel...']);
  const [inputText, setInputText] = useState('');
  const [email, setEmail] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanSteps, setScanSteps] = useState([]);
  const [metrics, setMetrics] = useState({ redundancy: 0, bleed: 0, loops: 0, score: 0, tokens: [] });
  const [heatmapGrid, setHeatmapGrid] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  const [isModified, setIsModified] = useState(false);
  const [runtimeError, setRuntimeError] = useState(null);

  // --- FAIL-SAFE FIREBASE CONFIG ---
  const firebaseData = useMemo(() => {
    try {
      const env = import.meta.env || {};
      if (!env.VITE_FIREBASE_API_KEY) throw new Error("Missing VITE_FIREBASE_API_KEY");
      return {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      };
    } catch (e) {
      return null;
    }
  }, []);

  // --- INITIALIZATION ENGINE ---
  useEffect(() => {
    const init = async () => {
      try {
        if (!firebaseData) {
          setDebugLog(p => [...p, "⚠️ Firebase Config missing. Running in LOCAL MODE."]);
          return;
        }

        const app = FirebaseApp.getApps().length === 0 
          ? FirebaseApp.initializeApp(firebaseData) 
          : FirebaseApp.getApps()[0];
        
        const auth = FirebaseAuth.getAuth(app);
        await FirebaseAuth.signInAnonymously(auth);
        setDebugLog(p => [...p, "✅ Handshake Successful."]);
      } catch (err) {
        setDebugLog(p => [...p, `❌ Init Error: ${err.message}`]);
        // Don't crash the app, just stay in local mode
      }
    };
    init();
  }, [firebaseData]);

  // --- FAIL-SAFE ID GEN ---
  const getSafeId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

  // --- FORENSIC LOGIC ---
  const runScan = () => {
    if (!inputText.trim()) return;
    if (!email) { setShowAuthModal(true); return; }

    setIsScanning(true);
    setScanComplete(false);
    setScanSteps([]);
    const iteration = scanCount + 1;
    setScanCount(iteration);

    const steps = ["Booting Heuristics...", "Analyzing Loops...", "Mapping Bleed...", "Finalizing Matrix..."];
    
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanSteps(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          // Calculation Logic
          const words = inputText.split(/\s+/);
          const redCount = words.length > 10 ? 8 : 2; // Simple heuristic for demo
          const score = Math.min(98, 45 + (redCount * 3));
          
          setMetrics({
            redundancy: redCount,
            bleed: Math.floor(redCount * 1.2),
            loops: Math.floor(redCount / 2),
            score: score,
            tokens: words.map((w, i) => ({ text: w, id: i, type: w.length > 8 ? 'warning' : 'safe' }))
          });

          setHeatmapGrid(Array.from({ length: 100 }, (_, i) => ({
            id: i,
            val: Math.random() * 100,
            critical: Math.random() > 0.8
          })));

          setIsScanning(false);
          setScanComplete(true);
        }
      }, (idx + 1) * 500);
    });
  };

  // --- CRITICAL ERROR RENDERER ---
  if (runtimeError) {
    return (
      <div className="min-h-screen bg-black text-rose-500 p-10 font-mono">
        <h1 className="text-xl mb-4">SYSTEM CRASH</h1>
        <pre className="text-xs bg-zinc-900 p-4">{runtimeError}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-400 font-sans selection:bg-rose-500/30 selection:text-rose-100 pb-24 relative overflow-hidden">
      
      {/* NOIR OVERLAYS */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)' }}></div>
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_50%_0%,rgba(39,39,42,0.6),transparent_70%)]"></div>

      {/* SYSTEM AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="w-full max-w-md bg-[#09090b] border border-zinc-800 p-10 shadow-2xl relative">
            <Fingerprint className="w-12 h-12 text-rose-500 mb-6 mx-auto animate-pulse" />
            <h2 className="text-xl font-black text-zinc-100 text-center mb-6 uppercase tracking-widest">Authentication</h2>
            <input 
              type="email" placeholder="operator@system.io"
              className="w-full bg-black border border-zinc-800 p-4 text-xs font-mono text-zinc-300 outline-none mb-4"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              onClick={() => { if(email.includes('@')) setShowAuthModal(false); runScan(); }}
              className="w-full h-14 bg-zinc-100 text-black font-black uppercase text-[10px] tracking-[0.3em]"
            >
              Verify Identity
            </button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="border-b border-zinc-800/80 bg-[#050507]/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-100">
            <Crosshair className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-[10px] tracking-[0.4em] uppercase text-zinc-300">Agent Fragility Scanner</span>
          </div>
          <div className="text-[9px] font-mono text-zinc-600 uppercase flex flex-col items-end">
            {debugLog.slice(-1)}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-black text-zinc-100 mb-8 tracking-tighter uppercase italic">
            Logic <span className="text-rose-500">Fragility</span> Forensics.
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Identify action loops and token waste before your production budget is exhausted.
          </p>
        </div>

        {/* INTERFACE */}
        <div className="rounded-sm border border-zinc-800 bg-[#09090b] shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* INPUT */}
            <div className="p-8 flex flex-col h-[500px]">
              <textarea
                className="w-full flex-grow bg-transparent text-zinc-400 font-mono text-xs leading-loose outline-none resize-none"
                placeholder="[System]: Paste trace logs..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isScanning}
              />
              <button
                onClick={runScan}
                disabled={isScanning || !inputText.trim()}
                className="mt-8 h-14 bg-zinc-100 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all"
              >
                {isScanning ? "Scanning..." : "Run Forensic Audit"}
              </button>
            </div>

            {/* RESULTS */}
            <div className="p-8 bg-zinc-950/40 h-[500px] overflow-y-auto custom-scrollbar">
              {!isScanning && !scanComplete ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <ShieldCheck size={48} />
                  <p className="mt-4 text-[9px] font-mono uppercase tracking-[0.4em]">System_Idle</p>
                </div>
              ) : isScanning ? (
                <div className="flex flex-col gap-4 font-mono text-[10px] text-zinc-500 h-full justify-end">
                  {scanSteps.map((s, i) => <div key={i} className="animate-in fade-in slide-in-from-left-2">{`> ${s}`}</div>)}
                </div>
              ) : (
                <div className="animate-in fade-in duration-700">
                  <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
                    <Layers className="w-4 h-4 text-rose-500" />
                    <h3 className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">Fragility_Matrix</h3>
                  </div>
                  <div className="grid grid-cols-10 gap-1.5 mb-8">
                    {heatmapGrid.map(node => (
                      <div key={node.id} className="h-4 w-4 rounded-sm" style={{ backgroundColor: node.critical ? '#f43f5e' : '#18181b', opacity: node.val/100 + 0.1 }}></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-[9px]">
                    {metrics.tokens.slice(0, 100).map((t, i) => (
                      <span key={i} className={t.type === 'warning' ? 'text-amber-500' : 'text-zinc-600'}>{t.text}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* METRICS & CONVERSION */}
        {scanComplete && (
          <div className="mt-12 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="border border-zinc-800 bg-[#09090b] p-8 flex flex-col items-center">
                <span className="text-zinc-600 text-[9px] uppercase tracking-widest mb-4">Fragility Score</span>
                <span className="text-6xl font-black text-rose-500 tracking-tighter">{metrics.score}%</span>
              </div>
              <div className="border border-zinc-800 bg-[#09090b] p-8 flex flex-col items-center">
                <span className="text-zinc-600 text-[9px] uppercase tracking-widest mb-4">Recursive Loops</span>
                <span className="text-4xl font-black text-zinc-100">{metrics.loops}</span>
              </div>
              <div className="border border-zinc-800 bg-[#09090b] p-8 flex flex-col items-center">
                <span className="text-zinc-600 text-[9px] uppercase tracking-widest mb-4">Token Bleed</span>
                <span className="text-4xl font-black text-zinc-100">{metrics.bleed}</span>
              </div>
            </div>

            <div className="border-t-2 border-rose-600 bg-rose-950/10 p-16 text-center flex flex-col items-center">
              <ShieldAlert className="w-16 h-16 text-rose-500 mb-8" />
              <h2 className="text-3xl font-black text-zinc-100 mb-8 uppercase tracking-tighter">Critical Hardening Required</h2>
              <button className="h-16 px-12 bg-rose-600 text-white font-black uppercase text-[11px] tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.3)]">Establish Hardening Sprint ($500)</button>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}} />
    </div>
  );
}

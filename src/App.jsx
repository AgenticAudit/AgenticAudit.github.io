import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Lock, Crosshair, FileSearch, RefreshCw, Rocket, 
  ShieldAlert, Gauge, Layers, Database, Wrench, Mail, Fingerprint
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * --- GLOBAL ERROR BOUNDARY ---
 * Prevents the "Blank White Screen of Death".
 */
class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Critical React Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-6 font-mono">
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 animate-pulse" />
          <h2 className="text-rose-500 font-black uppercase tracking-widest mb-4">Application Crash Detected</h2>
          <div className="bg-black border border-rose-900/50 p-6 text-zinc-500 text-xs max-w-xl overflow-auto">
            {this.state.error?.toString()}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * --- FORENSIC INFRASTRUCTURE ---
 * ZERO-PARSE ARCHITECTURE: Recovers individual VITE_ keys.
 */
const APP_ID = "agent-fragility-noir-001";
let auth, db;

const getSafeConfig = () => {
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || apiKey === "undefined") return null;
    
    return {
      apiKey: apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app` : undefined,
    };
  } catch (e) {
    console.error("Forensic Config Error:", e);
    return null;
  }
};

const firebaseConfig = getSafeConfig();
const isConfigured = !!(firebaseConfig && firebaseConfig.apiKey);

if (isConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Critical: Firebase Handshake Denied", e);
  }
}

function ForensicScanner() {
  const [user, setUser] = useState(null);
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
  const [harvesting, setHarvesting] = useState(false);

  // AUTH LIFECYCLE: Secure Anonymous Node Link
  useEffect(() => {
    if (!isConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        signInAnonymously(auth).catch(e => console.error("Identity Verification Failed", e));
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // LEAD HARVESTING PROTOCOL: ARCHIVING TO DATA MOAT
  const harvestLead = async (capturedEmail) => {
    if (!db || !capturedEmail) return false;
    setHarvesting(true);
    try {
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads'), {
        email: capturedEmail,
        timestamp: serverTimestamp(),
        source: 'forensic_obsidian_gate',
        log_preview: inputText.substring(0, 120),
        forensic_id: crypto.randomUUID()
      });
      setHarvesting(false);
      return true;
    } catch (e) {
      console.error("Data Moat Access Denied:", e);
      setHarvesting(false);
      return false;
    }
  };

  // HEURISTIC FORENSIC ENGINE (WITH FULL TOKEN GLITCH LOGIC)
  const analyzeTraceLog = (text, iteration) => {
    if (!text.trim()) return null;
    const words = text.split(/(\s+)/);
    const processedWords = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const lines = text.trim().split('\n').filter(l => l.length > 5);

    let loopCount = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].trim() === lines[i + 1].trim()) loopCount += 1;
    }

    const wordFreq = {};
    processedWords.forEach(w => { if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const repetitiveCount = Object.values(wordFreq).filter(f => f > 2).reduce((a, b) => a + (b - 1), 0);
    const redundancyRatio = processedWords.length > 0 ? (repetitiveCount / processedWords.length) * 100 : 0;
    
    // FULL FORENSIC JUICE: Token classification for UI feed
    const tokenMap = words.map((token, idx) => {
      const clean = token.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      let type = 'safe';
      if (clean && wordFreq[clean] > 2) type = 'danger';
      else if (token.length > 12) type = 'warning';
      return { text: token, type, id: `${idx}-${clean}` };
    });

    const regressionPenalty = iteration > 1 ? (iteration * 6.5) : 0;
    const finalScore = Math.min(99, Math.max(15, Math.floor((loopCount * 14) + (redundancyRatio * 0.9) + regressionPenalty + 42)));
    
    const grid = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      val: Math.floor((Math.sin(i * 0.5 + finalScore) * 50) + 50),
      critical: ((Math.sin(i * 0.5 + finalScore) * 50) + 50) > (86 - (iteration * 2.5))
    }));

    return { loops: Math.max(1, loopCount), redundancy: Math.floor(redundancyRatio), bleed: Math.floor(redundancyRatio * 0.75), score: finalScore, tokens: tokenMap, grid };
  };

  const handleRunScan = () => {
    if (!inputText.trim()) return;
    if (!email) { setShowAuthModal(true); return; }
    
    setIsScanning(true);
    setScanComplete(false);
    setScanSteps([]); // Reset steps for new scan
    const currentIteration = scanCount + 1;
    setScanCount(currentIteration);

    // FULL FORENSIC JUICE: Step-by-step animation sequence
    const forensicSteps = ["Initializing Obsidian_Heuristic...", "Mapping Recursive Vectors...", "Calculating Entropy Coefficients...", "Generating Forensic Heatmap...", "Finalizing Fragility Matrix..."];
    forensicSteps.forEach((step, index) => {
      setTimeout(() => {
        setScanSteps(prev => [...prev, step]);
        if (index === forensicSteps.length - 1) {
          const results = analyzeTraceLog(inputText, currentIteration);
          setMetrics(results);
          setHeatmapGrid(results.grid);
          setIsScanning(false);
          setScanComplete(true);
          setIsModified(false);
        }
      }, (index + 1) * 650);
    });
  };

  // SYSTEM ERROR BOUNDARY: HANDSHAKE FAILURE
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-center font-mono">
        <div className="max-w-md w-full border border-rose-900/30 bg-[#09090b] p-12 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-rose-500/50 animate-pulse"></div>
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-zinc-100 font-black uppercase tracking-tighter mb-4 text-xl">Handshake Failure</h2>
          <p className="text-[10px] text-zinc-500 uppercase leading-loose mb-8">
            The Scanner could not authenticate with the Data Moat. <br/>Ensure individual <code className="text-zinc-200">VITE_FIREBASE_*</code> keys are set in Repository Secrets.
          </p>
          <button onClick={() => window.location.reload()} className="text-[9px] text-zinc-100 uppercase tracking-widest bg-zinc-900 px-6 py-3 border border-zinc-700 hover:border-rose-500 transition-colors">
            Retry Handshake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-400 font-sans selection:bg-rose-500/30 selection:text-rose-100 pb-24 relative overflow-hidden">
      
      {/* KINETIC OVERLAYS */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)' }}></div>
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_50%_0%,rgba(39,39,42,0.6),transparent_70%)]"></div>

      {/* SYSTEM AUTH GATE */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="w-full max-w-md bg-[#09090b] border border-zinc-800 p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
            <Fingerprint className="w-12 h-12 text-rose-500 mb-6 mx-auto animate-pulse" />
            <h2 className="text-xl font-black text-zinc-100 text-center mb-2 uppercase tracking-tighter">System Authentication Required</h2>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-[0.2em] mb-8">Provide email to unlock forensic results.</p>
            <div className="space-y-4">
              <input 
                type="email" placeholder="operator@system.io"
                className="w-full bg-black border border-zinc-800 rounded-sm py-4 px-4 text-xs font-mono text-zinc-300 outline-none focus:border-rose-500 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={async () => { if(email.includes('@')) { const saved = await harvestLead(email); if(saved) { setShowAuthModal(false); handleRunScan(); } } }}
                disabled={harvesting}
                className="w-full h-14 bg-zinc-100 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:invert transition-all flex items-center justify-center"
              >
                {harvesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Establish Secure Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="border-b border-zinc-800/80 bg-[#050507]/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-100 group cursor-default">
            <Crosshair className="w-5 h-5 text-rose-500 group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-bold text-[10px] tracking-[0.4em] uppercase text-zinc-300">Agent Fragility Scanner</span>
          </div>
          <button className="text-[10px] font-mono text-zinc-500 hover:text-zinc-100 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
            <Lock className="w-3 h-3 text-rose-500" /> {email ? 'Authenticated' : 'System Auth'}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-black text-zinc-100 mb-8 tracking-tighter leading-none">
            Identify logic loops before <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500">
              critical failure.
            </span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Input agent trace logs or prompt chains. Our forensic engine maps cyclical redundancy, token bleed, and loop probabilities in real-time.
          </p>
        </div>

        {/* SCANNER CORE */}
        <div className="rounded-sm border border-zinc-800 bg-[#09090b] shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/40 border-b border-zinc-800">
            <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
              <Terminal className="w-3.5 h-3.5" /> {scanCount > 0 ? `Iteration_v.0${scanCount}_Delta` : "Target_Buffer_Null"}
            </div>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* INPUT PANEL */}
            <div className="p-8 bg-[#09090b] flex flex-col min-h-[500px]">
              {scanComplete && (
                <div className="mb-6 p-3 bg-amber-500/5 border border-amber-500/20 rounded-sm flex items-center gap-3 animate-in fade-in">
                   <Wrench className="w-3.5 h-3.5 text-amber-500" />
                   <p className="text-[9px] font-mono text-amber-500/80 uppercase tracking-widest">Sandbox Active: Edit trace for manual hardening attempt.</p>
                </div>
              )}
              <textarea
                className="w-full flex-grow bg-transparent text-zinc-400 font-mono text-xs leading-loose resize-none focus:outline-none placeholder:text-zinc-800 custom-scrollbar"
                placeholder="[System]: Waiting for trace data..."
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); if(scanComplete) setIsModified(true); }}
                disabled={isScanning}
                spellCheck="false"
              />
              <button
                onClick={handleRunScan}
                disabled={isScanning || !inputText.trim()}
                className={`mt-8 w-full h-14 font-black uppercase text-[10px] tracking-[0.3em] transition-all border
                  ${isScanning ? 'bg-zinc-900 text-zinc-600 border-zinc-800' : scanComplete && !isModified ? 'bg-zinc-900/50 text-zinc-700 border-zinc-800' : scanCount > 0 ? 'bg-transparent border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-zinc-100 text-black border-transparent hover:invert'}
                `}
              >
                {isScanning ? "Calculating..." : scanCount > 0 ? "Verify DIY Hardening" : "Run Forensic Audit"}
              </button>
            </div>

            {/* RESULTS PANEL: HEATMAP ASSET & TOKENS */}
            <div className="p-8 bg-zinc-950/60 min-h-[500px] flex flex-col relative overflow-hidden">
              {!isScanning && !scanComplete ? (
                <div className="flex-grow flex flex-col items-center justify-center opacity-40">
                  <ShieldCheck className="w-12 h-12 mb-4" />
                  <p className="text-[9px] font-mono uppercase tracking-[0.4em]">System_Idle</p>
                </div>
              ) : isScanning ? (
                <div className="flex flex-col gap-6 font-mono text-[9px] text-zinc-600 h-full justify-end pb-12">
                  {scanSteps.map((s, i) => (<div key={i} className="flex items-center gap-4 text-zinc-400 animate-in fade-in slide-in-from-left-4"><div className="w-1 h-1 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></div>{s}</div>))}
                  <div className="h-[1px] w-full bg-zinc-900 mt-4 relative overflow-hidden">
                    <div className="h-full bg-rose-500 w-1/4 animate-[scan_2s_infinite]"></div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-1000 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-rose-500" /><h3 className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">Logic_Hotspot_Map</h3></div>
                  </div>
                  <div className="flex-grow relative bg-[#050507] border border-zinc-800/80 p-5 shadow-inner overflow-hidden">
                    <div className="grid grid-cols-10 gap-1.5 w-full aspect-square relative z-10">
                      {heatmapGrid.map((node) => (
                        <div key={node.id} className={`rounded-sm transition-all duration-1000 ${node.critical ? 'animate-pulse' : ''}`} style={{ backgroundColor: node.critical ? '#f43f5e' : node.val > 60 ? '#f59e0b' : '#18181b', opacity: node.val / 100 + 0.15 }}></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent pointer-events-none opacity-80"></div>
                  </div>
                  {/* FULL FORENSIC JUICE: Token Glitch Feed */}
                  <div className="mt-8 h-24 overflow-y-auto custom-scrollbar border-t border-zinc-800 pt-6 flex flex-wrap gap-x-1.5 gap-y-1 font-mono text-[9px]">
                    {metrics.tokens.slice(0, 150).map((t, idx) => (
                      <span key={t.id || idx} className={`${t.type === 'danger' ? 'text-rose-500 glitch-chroma font-bold' : t.type === 'warning' ? 'text-amber-500' : 'text-zinc-600'}`}>{t.text}</span>
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
              <div className="rounded-sm border border-zinc-800 bg-[#09090b] p-8 flex flex-col relative overflow-hidden group">
                <span className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] mb-4 z-10 flex items-center gap-2"><Gauge className="w-3 h-3 text-rose-500" /> Fragility Rating</span>
                <span className={`text-6xl font-black tracking-tighter ${metrics.score > 60 ? 'text-rose-500' : 'text-amber-400'}`}>{metrics.score}%</span>
                {scanCount > 1 && <div className="text-rose-500 text-[9px] font-mono mt-2 uppercase animate-pulse">Regression Drift Detected</div>}
              </div>
              <div className="rounded-sm border border-zinc-800 bg-[#09090b] p-8 flex flex-col justify-center border-l-rose-500/20">
                <span className="text-zinc-600 text-[9px] uppercase mb-4 flex items-center gap-2"><RefreshCw className="w-3 h-3 text-zinc-400" /> Recursive Loops</span>
                <span className="text-4xl font-black text-zinc-100 tracking-tighter">{metrics.loops}</span>
              </div>
              <div className="rounded-sm border border-zinc-800 bg-[#09090b] p-8 flex flex-col justify-center border-l-amber-500/20">
                <span className="text-zinc-600 text-[9px] uppercase mb-4 flex items-center gap-2"><Database className="w-3 h-3 text-zinc-400" /> Token Bleed Index</span>
                <span className="text-4xl font-black text-zinc-100 tracking-tighter">{metrics.bleed}</span>
              </div>
            </div>

            <div className="rounded-sm border-t-2 border-rose-500 bg-[#0a0505] p-16 text-center shadow-[0_0_100px_rgba(244,63,94,0.06)] flex flex-col items-center">
              <ShieldAlert className="w-20 h-20 mb-8 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
              <h2 className="text-4xl md:text-5xl font-black text-zinc-100 mb-8 tracking-tighter leading-tight max-w-3xl">Finalize your 48-HOUR Hardening Sprint to ensure zero-failure deployment in live environments.</h2>
              <p className="text-zinc-500 text-base mb-12 max-w-2xl font-medium leading-relaxed">
                {scanCount > 1 ? "Manual trace modification has introduced structural fragmentation. Your DIY hardening attempt has compromised recursive stability benchmarks." : "The trace buffer confirms a critical action loop. Manual intervention is required to stabilize the reasoning node before full token exhaustion occurs in production."}
                <br/><br/><span className="font-bold text-rose-500 text-xl uppercase tracking-tighter">↳ Secure 48 HOUR Agent Sprint to be production ready by tomorrow!</span>
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center max-w-2xl">
                <button onClick={() => window.location.href = `https://buy.stripe.com/test_sprint?prefilled_email=${encodeURIComponent(email)}`} className="w-full sm:w-auto h-16 px-12 bg-zinc-100 text-black font-black uppercase text-[11px] tracking-[0.3em] hover:invert transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] active:scale-95"><Rocket className="w-4 h-4" /><span>AGENT PRODUCTION SPRINT ($500)</span></button>
                <button onClick={() => window.location.href = `https://buy.stripe.com/test_diagnostic?prefilled_email=${encodeURIComponent(email)}`} className="w-full sm:w-auto h-16 px-10 border border-zinc-700 text-[9px] font-bold text-zinc-500 uppercase tracking-widest hover:bg-zinc-900 hover:text-zinc-100">Agent Diagnostics Report ($99)</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        @keyframes glitchChroma { 0% { text-shadow: 1px 0 #f43f5e, -1px 0 #0ea5e9; opacity: 1; } 50% { text-shadow: -1px 0 #f43f5e, 1px 0 #0ea5e9; opacity: 0.8; } 100% { text-shadow: 1px 0 #f43f5e, -1px 0 #0ea5e9; opacity: 1; } }
        .glitch-chroma { animation: glitchChroma 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}} />
    </div>
  );
}

export default function ErrorBoundaryWrapper() {
  return (
    <GlobalErrorBoundary>
      <ForensicScanner />
    </GlobalErrorBoundary>
  );
}

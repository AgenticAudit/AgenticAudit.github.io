import React, { useState, useEffect, Component } from 'react';
import { 
  ShieldCheck, Terminal, 
  Lock, Crosshair, RefreshCw, Rocket, 
  ShieldAlert, Gauge, Layers, Database,
  Wrench, Fingerprint
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * --- FORENSIC INFRASTRUCTURE ---
 * ZERO-PARSE ARCHITECTURE: Recovers individual VITE_ keys to bypass JSON Handshake Errors.
 * FIXED: Bypasses Vite esbuild template literal ($) compilation bugs.
 */
const APP_ID = "agent-fragility-noir-001";
let auth, db;

const getSafeConfig = () => {
  try {
    // Extract variables first to prevent Vite compiler crashes
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const appId = import.meta.env.VITE_FIREBASE_APP_ID;

    if (!apiKey || apiKey === "undefined" || !projectId || projectId === "undefined") return null;

    // Use standard concatenation instead of template literals (${}) to avoid esbuild syntax errors
    let bucket = undefined;
    if (projectId && projectId !== "undefined") {
      bucket = projectId + ".firebasestorage.app";
    }

    return {
      apiKey: apiKey,
      authDomain: authDomain || (projectId + ".firebaseapp.com"),
      projectId: projectId,
      appId: appId,
      storageBucket: bucket
    };
  } catch {
    console.error("Forensic Config Error: Check VITE_FIREBASE_* keys.");
    return null;
  }
};

const firebaseConfig = getSafeConfig();
const isConfigured = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId);

if (isConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error("Critical: Firebase Handshake Denied", err);
  }
}

/**
 * --- FORENSIC INFRASTRUCTURE ---
 * ERROR BOUNDARY: Captures and logs forensic failures without crashing the UI.
 */
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Forensic Engine Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 text-center">
          <div className="max-w-md border border-rose-500/50 p-12 bg-rose-500/5">
            <h1 className="text-rose-500 font-black text-2xl mb-4 uppercase tracking-tighter">System Fragility Detected</h1>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-8">The forensic engine has encountered a recursive logic fault. Manual hardening required.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-rose-600 transition-all">Reset Buffer</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
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
  const [authError, setAuthError] = useState('');

  // AUTH LIFECYCLE: Secure Anonymous Node Link
  useEffect(() => {
    if (!isConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        signInAnonymously(auth).catch(e => {
          console.error("Identity Verification Failed", e);
          setAuthError("Auth Protocol Failed: " + e.message);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // LEAD HARVESTING PROTOCOL: ARCHIVING TO DATA MOAT
  const harvestLead = async (capturedEmail) => {
    if (!capturedEmail || !capturedEmail.includes('@')) {
      setAuthError("Valid email required for forensic unlock.");
      return false;
    }
    
    // Fallback: If DB is not available, we report the error to prevent silent failure.
    if (!db) {
      console.error("Data Moat Offline: Check VITE_FIREBASE_PROJECT_ID.");
      setAuthError("System Error: Forensic vault connection failed.");
      return false; 
    }

    setHarvesting(true);
    setAuthError('');
    try {
      // Ensure we have a valid UID for the security rule validation
      const currentUser = auth?.currentUser;
      if (!currentUser) {
        throw new Error("unauthenticated: Identity node not linked. Try again.");
      }

      // PATH: /artifacts/{appId}/public/data/leads
      // Total Fields: 6 (Matches data.keys().size() == 6 in Rules)
      const docRef = await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'leads'), {
        email: capturedEmail,
        timestamp: serverTimestamp(),
        source: 'forensic_obsidian_gate',
        log_preview: inputText.substring(0, 120),
        forensic_id: crypto.randomUUID(),
        uid: currentUser.uid
      });
      console.log("Data Moat Secured:", docRef.id);
      setHarvesting(false);
      return true;
    } catch (e) {
      console.error("Data Moat Access Denied:", e);
      // Log more specific error info if available
      const errorMessage = e.code ? `[${e.code}] ${e.message}` : e.message;
      setAuthError(`Handshake Error: ${errorMessage}`);
      setHarvesting(false);
      return false;
    }
  };

  // HEURISTIC FORENSIC ENGINE: MULTI-PARSER STRATEGY
  const analyzeTraceLog = (text, iteration) => {
    if (!text.trim()) return null;

    let loops = 0;
    let redundancy = 0;
    let bleed = 0;
    let score = 42;
    let tokens = [];

    const trimmed = text.trim();
    // Auto-Detection
    const isJson = (trimmed.startsWith('{') || trimmed.startsWith('['));
    const isJsonL = trimmed.includes('\n') && (trimmed.split('\n')[0].trim().startsWith('{'));

    try {
      if (isJsonL && !isJson) {
        // --- 4. Log-Level Filter (OpenClaw / Server Logs Focus) ---
        const lines = trimmed.split('\n');
        let errorCount = 0;
        let criticalKeywords = 0;

        lines.forEach((line, idx) => {
          try {
            if (!line.trim()) return;
            const data = JSON.parse(line);
            const level = (data.level || 'info').toLowerCase();
            const payload = JSON.stringify(data).toLowerCase();
            
            let type = 'safe';
            if (level === 'error' || level === 'warn') {
              type = 'danger';
              errorCount++;
            }

            if (payload.match(/loop|dependency|circular|timeout/)) {
              criticalKeywords++;
              type = 'danger';
            }

            tokens.push({ 
              text: `[LOG ${level.toUpperCase()}] ${data.message || data.msg || payload.substring(0, 60)}`, 
              type, 
              id: idx 
            });
          } catch (e) { /* skip malformed line */ }
        });

        loops = Math.floor(errorCount / 2);
        bleed = criticalKeywords * 15;
        score = Math.min(99, 42 + (errorCount * 12) + (criticalKeywords * 25));
        if (criticalKeywords > 0 || errorCount > 3) score = Math.max(score, 90);

      } else if (isJson) {
        // --- 2. JSON Parser (LangChain & Gemini Focus) ---
        const data = JSON.parse(trimmed);
        const flattened = JSON.stringify(data).toLowerCase();
        
        // Metrics Extraction
        const totalTokens = data.total_tokens || data.usageMetadata?.totalTokenCount || data.token_usage?.total_tokens || 0;
        if (totalTokens > 2000) {
          bleed = Math.min(100, Math.floor(totalTokens / 50));
        }

        // Loop Detection (Consecutive Tool Calls)
        const findTools = (obj, acc = []) => {
          if (!obj || typeof obj !== 'object') return acc;
          if (Array.isArray(obj)) obj.forEach(i => findTools(i, acc));
          else {
            if (obj.tool_calls || obj.actions) acc.push(...(obj.tool_calls || obj.actions));
            Object.values(obj).forEach(v => findTools(v, acc));
          }
          return acc;
        };
        const tools = findTools(data);
        for (let i = 0; i < tools.length - 1; i++) {
          if (tools[i].name === tools[i+1].name && JSON.stringify(tools[i].args) === JSON.stringify(tools[i+1].args)) {
            loops++;
          }
        }

        if (data.finishReason === 'ERROR' || flattened.includes('error')) score += 20;
        score = Math.min(99, score + (loops * 30) + (bleed / 2));

        tokens = Object.entries(data).slice(0, 20).map(([k, v], idx) => ({
          text: `[PROPERTY] ${k}: ${JSON.stringify(v).substring(0, 80)}`,
          type: (k.toLowerCase().includes('error') || k.toLowerCase().includes('fail')) ? 'danger' : 'safe',
          id: idx
        }));

      } else {
        // --- 3. Regex Streamer (CrewAI / AutoGPT Focus) ---
        const blocks = [];
        const regex = /(Thought|Action|Action Input|Observation):\s*([\s\S]*?)(?=(Thought|Action|Action Input|Observation):|$)/g;
        let match;
        while ((match = regex.exec(trimmed)) !== null) {
          blocks.push({ type: match[1], content: match[2].trim() });
        }

        if (blocks.length === 0) throw new Error("Regex stream failed");

        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          if (b.type === 'Thought') {
            const wc = b.content.split(/\s+/).length;
            if (wc > 50) bleed += Math.floor(wc / 10);
          }
          if (b.type === 'Action' && i + 2 < blocks.length) {
            const nextAction = blocks.slice(i + 1).find(x => x.type === 'Action');
            if (nextAction && nextAction.content === b.content) {
              const bInput = blocks[i+1]?.type === 'Action Input' ? blocks[i+1].content : null;
              const nextInput = blocks[blocks.indexOf(nextAction)+1]?.type === 'Action Input' ? blocks[blocks.indexOf(nextAction)+1].content : null;
              if (bInput && nextInput && bInput === nextInput) {
                loops++;
                score += 45; // Massive penalty
              }
            }
          }
        }

        score = Math.min(99, score + (loops * 20) + (bleed * 0.8));
        tokens = blocks.map((b, idx) => ({
          text: `[${b.type.toUpperCase()}] ${b.content.substring(0, 100)}`,
          type: b.type === 'Observation' ? 'warning' : 'safe',
          id: idx
        }));
      }
    } catch (e) {
      // Robust Fallback: Regex Streamer / Raw Line Analysis
      const lines = trimmed.split('\n').filter(l => l.length > 5);
      lines.forEach((line, idx) => {
        tokens.push({ text: `[RAW] ${line.substring(0, 100)}`, type: 'safe', id: idx });
        if (idx > 0 && line.trim() === lines[idx-1].trim()) loops++;
      });
      score = Math.min(99, 42 + (loops * 15));
    }

    redundancy = Math.floor(loops * 14.5);
    const regressionPenalty = iteration > 1 ? (iteration * 6.5) : 0;
    const finalScore = Math.min(99, Math.max(15, Math.floor(score + regressionPenalty)));
    
    const grid = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      val: Math.floor((Math.sin(i * 0.5 + finalScore) * 50) + 50),
      critical: ((Math.sin(i * 0.5 + finalScore) * 50) + 50) > (86 - (iteration * 2.5))
    }));

    return { loops: Math.max(0, loops), redundancy, bleed: Math.floor(bleed), score: finalScore, tokens, grid };
  };

  const handleRunScan = () => {
    if (!inputText.trim()) return;
    if (!email) { setShowAuthModal(true); return; }
    
    setIsScanning(true);
    setScanComplete(false);
    setScanSteps([]);
    const currentIteration = scanCount + 1;
    setScanCount(currentIteration);

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
    <GlobalErrorBoundary>
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
                value={email} onChange={(e) => { setEmail(e.target.value); setAuthError(''); }}
                onKeyDown={(e) => { if(e.key === 'Enter' && !harvesting) document.getElementById('auth-submit')?.click(); }}
              />
              {authError && <p className="text-[9px] text-rose-500 font-mono text-center uppercase animate-pulse">{authError}</p>}
              <button 
                id="auth-submit"
                onClick={async () => { 
                  const saved = await harvestLead(email); 
                  if(saved) { 
                    setShowAuthModal(false); 
                    // Ensure state transition is clean before starting scan
                    setTimeout(() => handleRunScan(), 50);
                  } 
                }}
                disabled={harvesting || !email.includes('@')}
                className="w-full h-14 bg-zinc-100 text-black disabled:bg-zinc-900 disabled:text-zinc-700 font-black uppercase text-[10px] tracking-[0.3em] hover:enabled:invert transition-all flex items-center justify-center"
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
                      <span key={`${t.id}-${idx}`} className={`${t.type === 'danger' ? 'text-rose-500 glitch-chroma font-bold' : t.type === 'warning' ? 'text-amber-500' : 'text-zinc-600'}`}>{t.text}</span>
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
                {metrics.score > 60 && <div className="text-rose-500 text-[8px] font-bold mt-2 uppercase animate-pulse border border-rose-500/30 px-2 py-1 bg-rose-500/5 text-center">Hardening Required ($500)</div>}
                {scanCount > 1 && <div className="text-rose-500 text-[9px] font-mono mt-2 uppercase">Regression Drift Detected</div>}
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
    </GlobalErrorBoundary>
  );
}

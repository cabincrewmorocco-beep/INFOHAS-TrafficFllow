import React, { useState, useEffect, useMemo, useRef, useCallback, useContext, createContext } from 'react';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Activity, Plus, Settings, BarChart3, Globe, Smartphone, MousePointer2, Play, Pause, Trash2, Clock, Zap, ShieldCheck,
  ChevronRight, LogOut, User as UserIcon, LayoutDashboard, Server, Terminal, Database, RefreshCw, Search, Filter, Link as LinkIcon,
  Tag, AlertCircle, Users, Download, Upload, FileJson, Edit, CheckCircle2, XCircle, Target, Flag, CheckSquare,
  ShieldAlert, Globe2, Save, Navigation, Monitor, Share2, ExternalLink, MapPin, Lock, Shield, Sun, Moon, Battery,
  Timer, Layers, TrendingUp, Laptop, FileText, Bot, Sparkles, Mic, HelpCircle, Flame, UserPlus, Key, Eye, EyeOff, LogIn,
  Trophy, Hash, ShoppingBag, ArrowRight, BarChart2, HeartPulse, PieChart as PieIcon, ClipboardList, FileBarChart, SearchCode,
  UserCog, MoreHorizontal, Mail, X, AlertTriangle, MousePointer, FileType, Printer, Code2, Menu, Command, Layout,
  BrainCircuit, Map, LocateFixed, MessageCircle, Video, ThumbsUp, List, ListChecks, FileSearch, Bug, Cpu
} from 'lucide-react';

// --- MOCK FIREBASE IMPLEMENTATION ---
const initializeApp = (config: any) => ({});
const getAuth = (app: any) => ({});
const signInWithCustomToken = async (auth: any, token: string) => ({});
const signInAnonymously = async (auth: any) => ({});
const signOut = async (auth: any) => {};

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  [key: string]: any;
};

const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
  setTimeout(() => {
    callback({ uid: 'mock-user', email: 'admin@trafficflow.io', displayName: 'Enterprise Admin' });
  }, 800); 
  return () => {};
};

const getFirestore = (app: any) => ({});
const collection = (db: any, ...path: string[]) => ({});
const doc = (db: any, ...path: string[]) => ({});
const setDoc = async (ref: any, data: any) => {};
const getDoc = async (ref: any) => ({ exists: () => false, data: () => ({}) });
const addDoc = async (ref: any, data: any) => ({ id: 'new-doc' });
const updateDoc = async (ref: any, data: any) => {};
const deleteDoc = async (ref: any) => {};
const onSnapshot = (ref: any, next: (snap: any) => void, error?: (err: any) => void) => {
  setTimeout(() => next({ docs: [] }), 100);
  return () => {};
};
const query = (ref: any, ...args: any[]) => ref;
const where = (field: string, op: string, val: any) => ({});
const limit = (n: number) => ({});
const orderBy = (field: string, dir?: string) => ({});
const serverTimestamp = () => Date.now();
const increment = (n: number) => n;

declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;
declare const __firebase_config: string;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'traffic-flow-v31-22-volume-fix';

const defaultFirebaseConfig = JSON.stringify({
  apiKey: "AIzaSyMockKeyForDemoOnly",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abc"
});

const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : defaultFirebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- PHASE 1: PERSISTENCE & UI UTILITIES ---

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: React.ReactNode}) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-rose-100">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">System Safeguard Active</h2>
          <p className="text-sm text-slate-500 mb-4">The application caught a critical error. Data is safe.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800">Reload System</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

type ToastType = 'info' | 'success' | 'error' | 'warning';
const ToastContext = createContext<((message: string, type?: ToastType) => void) | null>(null);
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) return () => {}; 
  return context;
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<{id: number, message: string, type: ToastType}[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all animate-slide-in backdrop-blur-md border ${
            t.type === 'success' ? 'bg-emerald-500/95 text-white border-emerald-400' :
            t.type === 'error' ? 'bg-rose-500/95 text-white border-rose-400' :
            'bg-slate-800/95 text-white border-slate-700'
          }`}>
            {t.type === 'success' && <CheckCircle2 size={20} />}
            {t.type === 'error' && <AlertCircle size={20} />}
            {t.type === 'info' && <Zap size={20} />}
            <div>
               <p className="font-bold text-sm">{t.type.toUpperCase()}</p>
               <p className="text-xs opacity-90">{t.message}</p>
            </div>
            <button onClick={() => removeToast(t.id)} className="ml-auto opacity-60 hover:opacity-100"><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

const MousePathOverlay = ({ active }: { active: boolean }) => {
  const [paths, setPaths] = useState<{id: number, d: string}[]>([]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
        const startX = Math.floor(Math.random() * 100);
        const startY = Math.floor(Math.random() * 100);
        const endX = Math.floor(Math.random() * 100);
        const endY = Math.floor(Math.random() * 100);
        const ctrl1X = Math.floor(Math.random() * 100);
        const ctrl1Y = Math.floor(Math.random() * 100);
        
        const pathId = Date.now();
        const d = `M ${startX} ${startY} C ${ctrl1X} ${ctrl1Y}, ${endX} ${endY}, ${endX} ${endY}`;
        
        setPaths(prev => [...prev.slice(-4), { id: pathId, d }]); 
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map(p => (
            <path key={p.id} d={p.d} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400 animate-draw-path" strokeDasharray="100" strokeDashoffset="100">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" fill="freeze" />
                <animate attributeName="opacity" values="1;0" dur="2s" begin="0.5s" fill="freeze" />
            </path>
        ))}
    </svg>
  );
};

const SessionReplayFeed = ({ isRunning }: { isRunning: boolean }) => {
    const [action, setAction] = useState("Waiting for session...");
    const actions = [
        "Mouse moved to (124, 543)", "Scroll Down (25%)", "Hover on 'Pricing'", "Click 'Get Started'", 
        "Typing 'test@email.com'", "Scroll Up (10%)", "Mouse idle (2s)", "Navigate to /checkout"
    ];

    useEffect(() => {
        if (!isRunning) { setAction("Session Idle"); return; }
        const interval = setInterval(() => {
            setAction(actions[Math.floor(Math.random() * actions.length)]);
        }, 1200);
        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="font-bold">LIVE REPLAY:</span>
            <span className="truncate w-32">{action}</span>
        </div>
    );
};

const SkeletonDashboard = () => (
  <div className="h-screen flex bg-slate-50 dark:bg-slate-900 font-sans text-sm overflow-hidden">
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 hidden md:flex flex-col gap-6">
       <div className="flex items-center gap-3 mb-4">
         <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
         <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-32"></div>
       </div>
       <div className="space-y-3 mt-4">
         {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>)}
       </div>
       <div className="mt-auto space-y-3">
         <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
         <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
       </div>
    </div>
    <div className="flex-1 p-8 space-y-8 overflow-hidden">
       <div className="flex justify-between items-center">
         <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
         </div>
         <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>)}
       </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
       </div>
    </div>
  </div>
);

const CommandPalette = ({ isOpen, onClose, onNavigate, actions }: { isOpen: boolean, onClose: () => void, onNavigate: (id: string) => void, actions: { label: string, action: () => void, icon: any }[] }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  const navigationItems = [
      { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard },
      { id: 'campaigns', label: 'Go to Campaigns', icon: Activity },
      { id: 'proxies', label: 'Go to Proxies', icon: Server },
      { id: 'logs', label: 'Go to Logs', icon: Terminal },
      { id: 'users', label: 'Go to Users', icon: UserIcon },
  ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[60vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
                <Search className="text-slate-400" size={20} />
                <input 
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent outline-none text-lg text-slate-700 dark:text-white placeholder-slate-400"
                />
                <div className="flex gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">ESC</span>
                </div>
            </div>
            <div className="overflow-y-auto p-2">
                {navigationItems.length > 0 && (
                    <div className="mb-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2">Navigation</div>
                        {navigationItems.map(item => (
                            <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                <item.icon size={16} className="text-slate-400" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
                {filteredActions.length > 0 && (
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase px-3 py-2">Actions</div>
                        {filteredActions.map((item, idx) => (
                            <button key={idx} onClick={() => { item.action(); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                <item.icon size={16} className="text-slate-400" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
                {navigationItems.length === 0 && filteredActions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">No results found.</div>
                )}
            </div>
        </div>
    </div>
  );
};

const formatUrlToTitle = (url: string, defaultTitle: string) => {
  try {
    const safeUrl = url || 'https://example.com';
    const urlObj = new URL(safeUrl);
    let path = urlObj.pathname;
    if (path === '/' || path === '') return defaultTitle;
    let cleanTitle = path.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
    cleanTitle = cleanTitle.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return cleanTitle || defaultTitle;
  } catch (e) {
    return defaultTitle;
  }
};

const safeString = (val: any) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  try {
    return JSON.stringify(val);
  } catch (e) {
    return '';
  }
};

const getLogTime = (timestamp: any) => {
  if (!timestamp) return '...';
  try {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    }
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d.toLocaleTimeString();
  } catch (e) {
    return 'Error';
  }
  return '...';
};

// --- UPDATED REFERRER MANAGER (v17.4 EXPANDED) ---
const ReferrerManager = {
  getOrganicSearch: (engine: string, keyword: string) => {
    const q = encodeURIComponent(keyword || 'search');
    switch(engine) {
      case 'google': return `https://www.google.com/search?q=${q}&oq=${q}&sourceid=chrome&ie=UTF-8`;
      case 'bing': return `https://www.bing.com/search?q=${q}`;
      case 'yahoo': return `https://search.yahoo.com/search?p=${q}`;
      case 'duckduckgo': return `https://duckduckgo.com/?q=${q}`;
      case 'baidu': return `https://www.baidu.com/s?wd=${q}`;
      case 'yandex': return `https://yandex.com/search/?text=${q}`;
      case 'ask': return `https://www.ask.com/web?q=${q}`;
      case 'aol': return `https://search.aol.com/aol/search?q=${q}`;
      case 'wolframalpha': return `https://www.wolframalpha.com/input/?i=${q}`;
      // Expanded Engines v17.4
      case 'naver': return `https://search.naver.com/search.naver?query=${q}`;
      case 'seznam': return `https://search.seznam.cz/?q=${q}`;
      case 'daum': return `https://search.daum.net/search?q=${q}`;
      case 'ecosia': return `https://www.ecosia.org/search?q=${q}`;
      case 'qwant': return `https://www.qwant.com/?q=${q}`;
      case 'sogou': return `https://www.sogou.com/web?query=${q}`;
      case 'brave': return `https://search.brave.com/search?q=${q}`;
      case 'petal': return `https://petalsearch.com/search?query=${q}`;
      case 'kvasir': return `https://kvasir.no/alle?q=${q}`;
      default: return `https://www.google.com/search?q=${q}`;
    }
  },
  getSocial: (platform: string) => {
    switch(platform) {
      case 'facebook': return 'https://l.facebook.com/';
      case 'twitter': return 'https://t.co/';
      case 'linkedin': return 'https://www.linkedin.com/';
      case 'instagram': return 'https://l.instagram.com/';
      case 'pinterest': return 'https://www.pinterest.com/';
      case 'tiktok': return 'https://www.tiktok.com/';
      case 'reddit': return 'https://www.reddit.com/';
      case 'snapchat': return 'https://www.snapchat.com/';
      case 'whatsapp': return 'https://web.whatsapp.com/';
      case 'telegram': return 'https://web.telegram.org/';
      case 'quora': return 'https://www.quora.com/';
      case 'discord': return 'https://discord.com/';
      case 'twitch': return 'https://www.twitch.tv/';
      case 'youtube': return 'https://www.youtube.com/';
      default: return 'https://l.facebook.com/';
    }
  },
  getAISearch: (engine: string) => {
      switch(engine) {
          case 'chatgpt': return 'https://chatgpt.com/';
          case 'gemini': return 'https://gemini.google.com/';
          case 'claude': return 'https://claude.ai/';
          case 'perplexity': return 'https://www.perplexity.ai/';
          case 'copilot': return 'https://copilot.microsoft.com/';
          default: return 'https://chatgpt.com/';
      }
  },
  getLocalDiscovery: (app: string, keyword: string) => {
      const q = encodeURIComponent(keyword || 'business near me');
      switch(app) {
          case 'google_maps': return `https://www.google.com/maps/search/${q}`;
          case 'apple_maps': return 'https://maps.apple.com/';
          case 'waze': return 'https://www.waze.com/';
          case 'yelp': return `https://www.yelp.com/search?find_desc=${q}`;
          case 'tripadvisor': return 'https://www.tripadvisor.com/';
          case 'foursquare': return `https://foursquare.com/explore?q=${q}`;
          case 'bing_maps': return `https://www.bing.com/maps?q=${q}`;
          default: return `https://www.google.com/maps/search/${q}`;
      }
  },
  getLSIVariation: (keyword: string) => {
     if (!keyword) return 'search';
     const variations = [
       (k: string) => `best ${k}`, (k: string) => `${k} reviews`, (k: string) => `top rated ${k}`, 
       (k: string) => `${k} guide`, (k: string) => `how to ${k}`, (k: string) => `buy ${k}`, (k: string) => k, (k: string) => k
     ];
     return variations[Math.floor(Math.random() * variations.length)](keyword);
  },
  getLocalIntent: (keyword: string, city?: string) => {
     if (!keyword) return 'local business near me';
     const suffixes = ["near me", "nearby", `in ${city || 'my area'}`, "open now"];
     return `${keyword} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }
};

// --- REAL SCRAPER & SERP ENGINE (v17.4 CORS PROXY) ---
const ScraperEngine = {
    // We use a public CORS proxy to allow frontend fetching of real URLs
    PROXY_BASE: 'https://api.allorigins.win/get?url=',

    async fetchPage(url: string) {
        try {
            // Encode the target URL to pass through the proxy
            const response = await fetch(`${this.PROXY_BASE}${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            // allorigins returns the full object: { contents: "...", status: { url: "...", http_code: 200, ... } }
            return await response.json(); 
        } catch (error) {
            console.warn("Real scrape failed.", error);
            return null;
        }
    },

    extractKeywordsFromText(text: string): string[] {
        if(!text) return [];
        const stopwords = new Set(['the','and','a','to','of','in','is','for','on','that','by','this','with','i','you','it','not','or','be','are','from','at','as','your','all','have','new','more','an','was','we','will','site','page','web','home','menu','search', 'login', 'signup', 'copyright', 'privacy', 'policy', 'terms']);
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopwords.has(w) && !/^\d+$/.test(w));
        
        const frequency: Record<string, number> = {};
        words.forEach(w => { frequency[w] = (frequency[w] || 0) + 1; });
        
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10) 
            .map(entry => entry[0]);
    },

    extractQuestions(doc: Document): string[] {
        const questions: string[] = [];
        // H tags and Strong tags often contain questions in FAQs
        doc.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, p').forEach(el => {
            const text = el.textContent?.trim();
            // Strict heuristics for questions
            if (text && text.length > 10 && text.length < 150 && text.endsWith('?') && !questions.includes(text)) {
                questions.push(text);
            }
        });
        return questions.slice(0, 8);
    },

    async deepCrawl(startUrl: string, onLog: (msg: string) => void): Promise<{urls: any[], keywords: string[], questions: string[], niche: string} | null> {
        onLog(`Connecting to ${startUrl} via CORS Proxy...`);
        const data = await this.fetchPage(startUrl);
        
        if (!data || !data.contents) {
            onLog('Connection failed (CORS/Blocking). Aborting to prevent fake data.');
            return null; // STRICT: No fallback
        }

        const html = data.contents;
        const finalUrl = data.status?.url || startUrl; // Use the actual final URL (after redirects) for resolution
        
        onLog('HTML Content received. Parsing DOM...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract Title & Meta
        const pageTitle = doc.querySelector('title')?.innerText || '';
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1Text = doc.querySelector('h1')?.textContent || '';
        onLog(`Identified Page: ${pageTitle.substring(0, 30)}...`);

        // Extract Links
        const rawLinks = Array.from(doc.querySelectorAll('a'));
        const uniqueUrls = new Set<string>();
        const crawledUrls: any[] = [];
        
        let startOrigin = '';
        try {
            const u = new URL(finalUrl);
            startOrigin = u.origin;
        } catch(e) { 
            onLog('Invalid Start URL'); 
            return null;
        }

        rawLinks.slice(0, 150).forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                try {
                    // Robust URL resolution using the FINAL Redirected URL as base
                    const resolved = new URL(href, finalUrl);
                    
                    const isHttp = resolved.protocol === 'http:' || resolved.protocol === 'https:';
                    const isSameOrigin = resolved.origin === startOrigin;
                    const isNotAnchor = !resolved.href.includes('#');
                    const isNotFile = !resolved.pathname.match(/\.(jpg|jpeg|png|gif|pdf|zip|svg)$/i);

                    if (isHttp && isSameOrigin && isNotFile && !uniqueUrls.has(resolved.href)) {
                        uniqueUrls.add(resolved.href);
                        crawledUrls.push({
                            url: resolved.href,
                            title: a.innerText.trim() || 'Internal Link',
                            status: 200
                        });
                    }
                } catch(e) {
                    // Ignore parse errors
                }
            }
        });
        
        onLog(`Extracted ${crawledUrls.length} valid internal links.`);

        // Extract Keywords from Body (Weighted)
        onLog('Analyzing Text Density for SEO Keywords...');
        const bodyText = doc.body.innerText;
        // High weight to Title/H1/Meta
        const weightedText = `${pageTitle} ${pageTitle} ${h1Text} ${h1Text} ${metaDesc} ${bodyText}`;
        const keywords = this.extractKeywordsFromText(weightedText);
        
        // Extract Real Questions from Content
        const questions = this.extractQuestions(doc);

        const niche = keywords.includes('shop') || keywords.includes('cart') || keywords.includes('price') ? 'ecommerce' : 'general';

        return { urls: crawledUrls, keywords, questions, niche };
    }
};

const SERPEngine = {
    // Fetches REAL suggestions from Google Suggest API via Proxy
    // Does NOT use templates.
    async fetchRealSuggestions(keyword: string, proxyBase: string): Promise<string[]> {
        try {
            const url = `http://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(keyword)}`;
            const res = await fetch(`${proxyBase}${encodeURIComponent(url)}`);
            if (!res.ok) return [];
            const data = await res.json(); // ["keyword", ["sugg1", "sugg2", ...]]
            if (data && data.contents) {
                 // Handle allorigins wrapping if using that proxy base
                 return JSON.parse(data.contents)[1] || [];
            }
            return data[1] || [];
        } catch (e) {
            console.warn("SERP Fetch failed", e);
            return [];
        }
    }
};

const FingerprintRotator = {
// ... existing fingerprint code ...
  getRandomProfile: (targetOS: string, countryCode = 'US') => {
    const osMap: Record<string, any> = {
      'Windows': { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36", res: "1920x1080", vp: "1920x969", mobile: false },
      'MacOS': { ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15", res: "2560x1440", vp: "2560x1305", mobile: false },
      'iOS': { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", res: "390x844", vp: "390x700", mobile: true },
      'Android': { ua: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.80 Mobile Safari/537.36", res: "1080x2340", vp: "1080x2100", mobile: true }
    };
    
    let os = targetOS;
    if (os === 'Random' || !osMap[os]) {
      os = Math.random() < 0.6 ? (Math.random() > 0.5 ? 'Android' : 'iOS') : (Math.random() > 0.5 ? 'Windows' : 'MacOS');
    }
    
    const profile = osMap[os];
    const languageMap: Record<string, string> = { 'US': 'en-us', 'GB': 'en-gb', 'FR': 'fr-fr', 'DE': 'de-de', 'ES': 'es-es', 'IT': 'it-it', 'NL': 'nl-nl', 'JP': 'ja-jp', 'CN': 'zh-cn', 'MA': 'fr-ma', 'SA': 'ar-sa', 'RU': 'ru-ru', 'TR': 'tr-tr' };
    const lang = languageMap[countryCode] || 'en-us';
    const depth = Math.random() > 0.8 ? '30-bit' : '24-bit';
    
    return { ...profile, osName: os, ul: lang, sd: depth };
  }
};

const CONTINENT_DATA: Record<string, {name: string, code: string}[]> = {
// ... existing continent data ...
  'Europe': [
    { name: 'Belgium', code: 'BE' }, { name: 'Germany', code: 'DE' }, { name: 'France', code: 'FR' }, 
    { name: 'United Kingdom', code: 'GB' }, { name: 'Italy', code: 'IT' }, { name: 'Spain', code: 'ES' }, 
    { name: 'Netherlands', code: 'NL' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, 
    { name: 'Poland', code: 'PL' }, { name: 'Austria', code: 'AT' }, { name: 'Portugal', code: 'PT' },
    { name: 'Norway', code: 'NO' }, { name: 'Finland', code: 'FI' }, { name: 'Denmark', code: 'DK' },
    { name: 'Ireland', code: 'IE' }, { name: 'Greece', code: 'GR' }, { name: 'Czech Republic', code: 'CZ' },
    { name: 'Romania', code: 'RO' }, { name: 'Hungary', code: 'HU' }
  ],
  'North America': [
    { name: 'United States', code: 'US' }, { name: 'Canada', code: 'CA' }, { name: 'Mexico', code: 'MX' },
    { name: 'Panama', code: 'PA' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Dominican Republic', code: 'DO' }
  ],
  'Asia': [
    { name: 'Japan', code: 'JP' }, { name: 'India', code: 'IN' }, { name: 'Singapore', code: 'SG' }, 
    { name: 'South Korea', code: 'KR' }, { name: 'China', code: 'CN' }, { name: 'Thailand', code: 'TH' },
    { name: 'Vietnam', code: 'VN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Malaysia', code: 'MY' }, 
    { name: 'UAE', code: 'AE' }, { name: 'Philippines', code: 'PH' }, { name: 'Taiwan', code: 'TW' },
    { name: 'Saudi Arabia', code: 'SA' }, { name: 'Turkey', code: 'TR' }, { name: 'Israel', code: 'IL' }
  ],
  'South America': [
    { name: 'Brazil', code: 'BR' }, { name: 'Argentina', code: 'AR' }, { name: 'Chile', code: 'CL' }, 
    { name: 'Colombia', code: 'CO' }, { name: 'Peru', code: 'PE' }, { name: 'Venezuela', code: 'VE' },
    { name: 'Ecuador', code: 'EC' }, { name: 'Uruguay', code: 'UY' }
  ],
  'Africa': [
    { name: 'South Africa', code: 'ZA' }, { name: 'Egypt', code: 'EG' }, { name: 'Nigeria', code: 'NG' }, 
    { name: 'Kenya', code: 'KE' }, { name: 'Morocco', code: 'MA' }, { name: 'Ghana', code: 'GH' },
    { name: 'Tanzania', code: 'TZ' }, { name: 'Uganda', code: 'UG' }, { name: 'Algeria', code: 'DZ' }
  ],
  'Oceania': [
    { name: 'Australia', code: 'AU' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Fiji', code: 'FJ' }
  ]
};

const IP_PREFIXES: Record<string, string[]> = {
// ... existing IP prefixes ...
  'US': ['67.160', '73.10', '98.200'], 'DE': ['84.128', '93.192', '87.128'], 'FR': ['82.127', '80.10', '90.0'], 
  'GB': ['86.128', '81.128', '109.144'], 'IT': ['87.0', '79.0', '2.32'], 'ES': ['80.58', '88.0', '83.32'], 
  'NL': ['80.56', '83.80', '86.80'], 'BE': ['81.240', '91.176', '109.128'], 'SE': ['90.224', '81.224', '78.64'], 
  'CH': ['178.238', '85.0', '62.200'], 'PL': ['83.20', '80.50'], 'AT': ['62.47', '80.120'], 'PT': ['188.80', '2.80'], 
  'CA': ['174.0', '24.64'], 'MX': ['189.130', '201.128'], 'JP': ['126.0', '60.64', '118.0'], 'IN': ['122.160', '59.144'], 
  'SG': ['116.86', '118.200'], 'KR': ['211.32', '220.64'], 'CN': ['123.125', '220.181'], 'BR': ['189.0', '177.0'], 
  'ZA': ['105.0', '41.128'], 'MA': ['41.248', '105.128'], 'AU': ['121.0', '58.160'], 'NZ': ['122.56', '222.152'],
  'AR': ['181.16'], 'CL': ['186.104'], 'CO': ['186.154'], 'PE': ['190.232'],
  'NO': ['84.210', '92.220'], 'FI': ['80.220', '84.230'], 'DK': ['80.160', '87.50'], 'IE': ['89.100', '95.140'],
  'GR': ['94.64', '79.128'], 'CZ': ['78.100', '89.176'], 'RO': ['86.120', '79.112'], 'HU': ['84.0', '91.120'],
  'PA': ['190.140'], 'CR': ['201.192'], 'DO': ['148.101'],
  'PH': ['112.200', '49.144'], 'TW': ['111.240', '114.32'], 'SA': ['51.253', '93.168'], 'TR': ['88.224', '78.160'], 'IL': ['79.176', '109.64'],
  'VE': ['190.200'], 'EC': ['186.68'], 'UY': ['167.56'],
  'GH': ['154.160'], 'TZ': ['41.59'], 'UG': ['41.210'], 'DZ': ['154.121'],
  'FJ': ['103.143']
};

const COUNTRY_COORDS: Record<string, {top: string, left: string, color: string}> = {
// ... existing country coords ...
  'US': { top: '35%', left: '18%', color: 'bg-blue-500' }, 'CA': { top: '22%', left: '22%', color: 'bg-blue-400' }, 'MX': { top: '45%', left: '18%', color: 'bg-emerald-500' }, 'BR': { top: '65%', left: '30%', color: 'bg-emerald-400' }, 'GB': { top: '24%', left: '46%', color: 'bg-indigo-400' }, 'FR': { top: '28%', left: '48%', color: 'bg-indigo-500' }, 'DE': { top: '26%', left: '50%', color: 'bg-indigo-600' }, 'ES': { top: '32%', left: '46%', color: 'bg-indigo-300' }, 'IT': { top: '31%', left: '51%', color: 'bg-indigo-500' }, 'BE': { top: '26%', left: '48%', color: 'bg-indigo-400' }, 'NL': { top: '25%', left: '49%', color: 'bg-indigo-400' }, 'SE': { top: '20%', left: '51%', color: 'bg-indigo-300' }, 'CH': { top: '28%', left: '50%', color: 'bg-indigo-500' }, 'PL': { top: '25%', left: '53%', color: 'bg-indigo-400' }, 'PT': { top: '32%', left: '45%', color: 'bg-indigo-300' }, 'MA': { top: '40%', left: '46%', color: 'bg-amber-500' }, 'ZA': { top: '75%', left: '54%', color: 'bg-amber-600' }, 'EG': { top: '42%', left: '55%', color: 'bg-amber-400' }, 'NG': { top: '55%', left: '50%', color: 'bg-amber-500' }, 'KE': { top: '58%', left: '56%', color: 'bg-amber-400' }, 'IN': { top: '45%', left: '70%', color: 'bg-rose-500' }, 'JP': { top: '35%', left: '85%', color: 'bg-rose-600' }, 'CN': { top: '35%', left: '76%', color: 'bg-rose-400' }, 'SG': { top: '55%', left: '78%', color: 'bg-rose-500' }, 'KR': { top: '35%', left: '82%', color: 'bg-rose-500' }, 'TH': { top: '48%', left: '76%', color: 'bg-rose-400' }, 'VN': { top: '48%', left: '78%', color: 'bg-rose-500' }, 'ID': { top: '60%', left: '78%', color: 'bg-rose-400' }, 'MY': { top: '55%', left: '77%', color: 'bg-rose-500' }, 'AE': { top: '43%', left: '62%', color: 'bg-rose-300' }, 'AU': { top: '75%', left: '84%', color: 'bg-purple-500' }, 'NZ': { top: '85%', left: '90%', color: 'bg-purple-400' }, 'AT': { top: '27%', left: '51%', color: 'bg-indigo-400' }, 'AR': { top: '75%', left: '29%', color: 'bg-emerald-500' }, 'CL': { top: '75%', left: '26%', color: 'bg-emerald-400' }, 'CO': { top: '55%', left: '25%', color: 'bg-emerald-400' }, 'PE': { top: '62%', left: '24%', color: 'bg-emerald-500' }
};

const CustomIcons = {
  Logo: () => <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30"><Zap size={20} /></div>
};

// --- COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => ( <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}><Icon size={20} /> <span className="font-medium text-sm">{label}</span></button> );

interface StatCardProps {
// ... existing props ...
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtext: string;
  trend?: string;
}

const StatCard = React.memo(({ title, value, icon, color, subtext, trend }: StatCardProps) => (
  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity ${color}`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{title}</h3>
          <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</div>
        </div>
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-slate-700 dark:text-slate-200`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend && <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{trend}</span>}
        <span className="text-xs text-slate-400 font-medium">{subtext}</span>
      </div>
    </div>
  </div>
));

const Icons = {
// ... existing icons ...
    Proxies: () => <Globe2 size={18} />,
    Download: () => <Download size={16} />,
    Plugin: () => <Server size={16} />,
    Delete: () => <Trash2 size={16} />
};

// --- ProxiesTab Component ---
const ProxiesTab = ({ proxies, setProxies, scrapping, onScrape, onDeleteAll, onExtensionScrape }: any) => (
// ... existing ProxiesTab code ...
  <div className="space-y-6 animate-fade-in">
    <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl relative overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <Icons.Proxies /> Infrastructure Collector
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Import or scrape fresh proxy nodes to anonymize traffic.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            Node Status: Online
          </span>
        </div>
        <form onSubmit={onScrape} className="flex gap-4">
          <input 
            name="sourceUrl"
            defaultValue="https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000" 
            className="flex-1 p-3 rounded-xl text-xs font-mono text-slate-600 outline-none border border-slate-300 shadow-sm bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 transition-all" 
          />
          <button 
            type="submit"
            disabled={scrapping}
            className="bg-blue-800 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-900 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scrapping ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Icons.Download />}
            {scrapping ? 'Scraping...' : 'Start Scraper'}
          </button>
        </form>
      </div>
    </div>
    
    <div className="p-6 border border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10">
      <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
            <Icons.Plugin />
            Scraper Extension Module
          </h4>
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Additive Layer</span>
      </div>
      <div className="flex gap-4 items-center">
          <select className="p-3 rounded-xl text-xs font-bold text-slate-600 outline-none border border-slate-300 shadow-sm bg-white dark:bg-slate-700 w-48">
              <option>HTTP/HTTPS</option>
              <option>SOCKS4</option>
              <option>SOCKS5</option>
          </select>
          <button 
            onClick={onExtensionScrape}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
              Deep Scrape (Extension)
          </button>
          <p className="text-[10px] text-slate-400 ml-auto max-w-md text-right">
            Injects premium nodes from external extension source. Existing proxy pool remains active.
          </p>
      </div>
    </div>
    
    <div className="flex justify-between items-center mt-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Proxy List ({proxies.length})</h3>
      <button onClick={onDeleteAll} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-2">
        <Icons.Delete /> Clear All
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {proxies.slice(0, 100).map((proxy: any) => (
        <div key={proxy.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group shadow-sm hover:border-blue-300 transition-colors">
          <div>
            <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{safeString(proxy.address)}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">{safeString(proxy.source)}</div>
          </div>
          <button onClick={() => setProxies((prev: any[]) => prev.filter(p => p.id !== proxy.id))} className="text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Icons.Delete />
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- USERS TAB (ADMIN) (PRESERVED) ---
const UsersTab = ({ users, onAddUser, onEditUser, onDeleteUser, onResetPassword }: any) => {
// ... existing UsersTab code ...
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      id: editingUser ? editingUser.id : null
    };
    
    if (editingUser) {
      onEditUser(userData);
    } else {
      onAddUser(userData);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              <UserCog size={22} className="text-blue-600" /> User Management
            </h3>
            <p className="text-slate-500 text-sm mt-1">Manage platform access and security privileges.</p>
          </div>
          <button onClick={() => { setEditingUser(null); setShowModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20">
            <UserPlus size={16} /> Add User
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onResetPassword(user.id)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password"><Key size={14} /></button>
                      <button onClick={() => { setEditingUser(user); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                      <button onClick={() => onDeleteUser(user.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400 text-xs">No users found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editingUser ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
                <input name="name" defaultValue={editingUser?.name} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm" placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm" placeholder="jane@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Role</label>
                  <select name="role" defaultValue={editingUser?.role || 'Viewer'} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm">
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Status</label>
                  <select name="status" defaultValue={editingUser?.status || 'Active'} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-sm">
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-500 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg text-sm">{editingUser ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Missing Modals ---
const ExportModal = ({ isOpen, onClose, logs, proxies, campaigns }: { isOpen: boolean, onClose: () => void, logs: any[], proxies: any[], campaigns: any[] }) => {
  if (!isOpen) return null;
  const handleDownload = (data: any, name: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl">Export Data</h3>
          <button onClick={onClose}><X className="text-slate-400" /></button>
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50 cursor-pointer" onClick={() => handleDownload(campaigns, 'campaigns')}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity size={20} /></div>
              <div><div className="font-bold">Campaign Data</div><div className="text-xs text-slate-500">Export all configuration</div></div>
            </div>
            <Download size={16} className="text-slate-400" />
          </div>
          <div className="p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50 cursor-pointer" onClick={() => handleDownload(proxies, 'proxies')}>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Server size={20} /></div>
              <div><div className="font-bold">Proxy List</div><div className="text-xs text-slate-500">Export active nodes</div></div>
            </div>
            <Download size={16} className="text-slate-400" />
          </div>
           <div className="p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50 cursor-pointer" onClick={() => handleDownload(logs, 'logs')}>
             <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Terminal size={20} /></div>
              <div><div className="font-bold">System Logs</div><div className="text-xs text-slate-500">Export execution logs</div></div>
            </div>
            <Download size={16} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ApiManagerModal = ({ isOpen, onClose, apiKeys, onCreate, onRevoke }: { isOpen: boolean, onClose: () => void, apiKeys: any[], onCreate: () => void, onRevoke: (id: string) => void }) => {
// ... existing ApiManagerModal code ...
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
         <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-xl">API Keys</h3>
            <p className="text-xs text-slate-500">Manage programmatic access tokens.</p>
          </div>
          <button onClick={onClose}><X className="text-slate-400" /></button>
        </div>
        <div className="mb-6 flex justify-end">
          <button onClick={onCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> Generate New Key</button>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {apiKeys.map(k => (
            <div key={k.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50">
              <div>
                <div className="font-mono text-sm font-bold text-slate-700">{k.key}</div>
                <div className="text-xs text-slate-400">Created: {new Date(k.created).toLocaleDateString()}</div>
              </div>
              <button onClick={() => onRevoke(k.id)} className="text-rose-500 text-xs font-bold hover:underline">Revoke</button>
            </div>
          ))}
          {apiKeys.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">No active API keys.</div>}
        </div>
      </div>
    </div>
  );
};

const DashboardTab = ({ stats, campaigns, isRunning, toggleEngine }: any) => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <StatCard title="Total Traffic" value={stats.audience.allUsers} icon={<Activity size={24}/>} color="bg-blue-500" subtext="Real-time hits" trend="+12%" />
       <StatCard title="Active Campaigns" value={campaigns.filter((c:any) => c.status === 'active').length} icon={<Flame size={24}/>} color="bg-orange-500" subtext="Running now" />
       <StatCard title="Conversions" value={stats.audience.purchasers} icon={<Trophy size={24}/>} color="bg-emerald-500" subtext="Goal completions" trend="+5%" />
       <StatCard title="System Load" value={isRunning ? "ACTIVE" : "IDLE"} icon={<Zap size={24}/>} color={isRunning ? "bg-emerald-500" : "bg-slate-400"} subtext="Engine Status" />
    </div>
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-80">
        <h3 className="font-bold text-lg mb-4">Traffic Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{n:1, v: 10}, {n:2, v: 20}, {n:3, v: 15}, {n:4, v: 30}, {n:5, v: 45}, {n:6, v: 60}]}>
                <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="n" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
  </div>
);

const CampaignsTab = ({ campaigns, onToggle, onEdit, onDelete, onNew }: any) => (
  <div className="space-y-6 animate-fade-in">
     <div className="flex justify-between items-center">
        <div>
            <h3 className="text-xl font-bold">Campaigns</h3>
            <p className="text-sm text-slate-500">Manage your traffic sources.</p>
        </div>
        <button onClick={onNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
            <Plus size={16} /> New Campaign
        </button>
     </div>
     <div className="grid gap-4">
        {campaigns.map((c: any) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        <h4 className="font-bold text-slate-800 dark:text-white">{c.name}</h4>
                        <span className="text-[10px] uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold">{c.trafficType}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex gap-4">
                        <span>Target: {c.targeting?.countryCode || 'Global'}</span>
                        <span>Hits: {c.stats?.hits || 0}</span>
                        <a href={c.urls[0]} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-500"><ExternalLink size={10}/> Preview</a>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onToggle(c)} className={`p-2 rounded-lg transition-colors ${c.status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                        {c.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => onEdit(c)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => onDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
            </div>
        ))}
        {campaigns.length === 0 && <div className="text-center p-8 text-slate-400">No campaigns found. Create one to start.</div>}
     </div>
  </div>
);

const LogsTab = ({ logs }: any) => (
  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs h-[500px] overflow-y-auto space-y-2 border border-slate-700">
     {logs.map((log: any) => (
         <div key={log.id} className="flex gap-3 border-b border-slate-800 pb-1 mb-1 last:border-0">
            <span className="opacity-50">[{getLogTime(log.timestamp)}]</span>
            <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-blue-300'}>{log.message}</span>
         </div>
     ))}
  </div>
);

const CampaignModal = ({ isOpen, onClose, onSubmit, campaign, scrapeUrl, onScrapeUrlChange, onAutoScrape, isScrapingSite, scrapingProgress, scrapeLogs, scrapedData }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h3 className="font-bold text-xl">{campaign ? 'Edit Campaign' : 'New Campaign'}</h3>
                        <button type="button" onClick={onClose}><X className="text-slate-400" /></button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Campaign Name</label>
                                <input name="name" defaultValue={campaign?.name} required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" placeholder="My Campaign" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Traffic Source</label>
                                <select name="trafficType" defaultValue={campaign?.trafficType || 'organic'} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none">
                                    <option value="organic">Organic Search (Random Engine)</option>
                                    <option value="organic_google">Google Search</option>
                                    <option value="social">Social Media (Random)</option>
                                    <option value="direct">Direct Traffic</option>
                                    <option value="custom">Custom Referrer</option>
                                </select>
                            </div>
                        </div>

                        {/* Scraper Section */}
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                            <label className="text-xs font-bold uppercase text-indigo-600 mb-2 block">Auto-Configuration (Optional)</label>
                            <div className="flex gap-2">
                                <input 
                                    value={scrapeUrl} 
                                    onChange={(e) => onScrapeUrlChange(e.target.value)} 
                                    placeholder="https://target-site.com" 
                                    className="flex-1 p-2 rounded-lg border border-indigo-200 text-sm"
                                />
                                <button type="button" onClick={onAutoScrape} disabled={isScrapingSite} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
                                    {isScrapingSite ? 'Scanning...' : 'Scan Site'}
                                </button>
                            </div>
                            {isScrapingSite && (
                                <div className="mt-2">
                                    <div className="h-1 bg-indigo-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-300" style={{width: `${scrapingProgress}%`}}></div></div>
                                    <div className="text-[10px] font-mono text-indigo-500 mt-1">{scrapeLogs[scrapeLogs.length-1]}</div>
                                </div>
                            )}
                            {scrapedData.keywords.length > 0 && (
                                <div className="mt-2 text-xs text-emerald-600 font-bold">
                                    <CheckCircle2 size={12} className="inline mr-1"/>
                                    Found {scrapedData.urls.length} URLs and {scrapedData.keywords.length} keywords. They will be merged on save.
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500">Target URLs (One per line)</label>
                            <textarea name="urls" defaultValue={campaign?.urls?.join('\n')} className="w-full p-3 h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none font-mono" placeholder="https://example.com/page1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Keywords</label>
                                <textarea name="keywords" defaultValue={campaign?.keywords?.join('\n')} className="w-full p-3 h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none" placeholder="seo, marketing" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Targeting</label>
                                <select name="continent" className="w-full p-2 mb-2 rounded-lg border border-slate-200 text-sm"><option value="Europe">Europe</option><option value="North America">North America</option></select>
                                <select name="country" className="w-full p-2 rounded-lg border border-slate-200 text-sm"><option value="Germany">Germany</option><option value="United States">USA</option></select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl font-bold text-slate-500 text-sm">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg text-sm">Save Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN CONTENT WRAPPER ---
const MainContent = () => {
// ... existing MainContent code ...
  const addToast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true); 
  
  // --- ADMIN AUTH STATE ---
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  
  // --- PHASE 3 STATE ---
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeys, setApiKeys] = usePersistentState<any[]>('tf_api_keys_v17', []);

  // --- PHASE 4 STATE ---
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- PERSISTENT STATE ---
  const [campaigns, setCampaigns] = usePersistentState<any[]>('tf_campaigns_v17_4', [
    {
      id: 'camp-1', name: 'Premium SEO Boost', status: 'active', trafficType: 'organic',
      urls: ['https://example.com/landing'], targeting: { continent: 'Europe', countryCode: 'DE' },
      ga4Id: 'G-DEMO123456', stats: { hits: 124 }, ecommerceMode: true, useProxies: true, targetOS: 'Windows',
      trafficPattern: 'Linear', scheduleStart: '08:00', scheduleEnd: '20:00',
      keywords: ['seo tools', 'marketing'], pasfKeywords: ['best seo tools 2024'], scrapedUrls: []
    }
  ]);
  
  const [proxies, setProxies] = usePersistentState<any[]>('tf_proxies_v16', []);
  const [logs, setLogs] = usePersistentState<any[]>('tf_logs_v16', []);
  const [trafficMode, setTrafficMode] = usePersistentState('tf_mode_v16', 'normal');

  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{sources: Record<string, number>, events: Record<string, number>, properties: any, keywords: Record<string, number>, pageTitles: any, audience: {allUsers: number, purchasers: number}}>({ 
    sources: {}, events: {}, properties: {}, keywords: {}, pageTitles: {}, audience: { allUsers: 0, purchasers: 0 }
  });
  
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [scrapping, setScrapping] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showEditCampaignModal, setShowEditCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
  
  // V17.4 REAL-TIME SCRAPER STATES
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScrapingSite, setIsScrapingSite] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState<{urls: any[], keywords: string[], pasf: string[], niche: string}>({ urls: [], keywords: [], pasf: [], niche: '' });
  const [scrapeLogs, setScrapeLogs] = useState<string[]>([]);

  const [selectedContinent, setSelectedContinent] = useState("Europe");
  const [selectedCountryCode, setSelectedCountryCode] = useState("DE");
  const [customSourceEnabled, setCustomSourceEnabled] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const engineTimerRef = useRef<any>(null); 
  const campaignsRef = useRef(campaigns);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const activeCountries = Array.from(new Set(campaigns.filter(c => c.status === 'active').map(c => c.targeting?.countryCode))).filter(Boolean);
  const activeRegions = activeCountries.length;

  useEffect(() => { campaignsRef.current = campaigns; }, [campaigns]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCmdPalette(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => { const requestWakeLock = async () => { if ('wakeLock' in navigator && isEngineRunning) { try { const lock = await (navigator as any).wakeLock.request('screen'); setWakeLock(lock); } catch (err) { } } }; requestWakeLock(); }, [isEngineRunning]);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase Auth Error:", err);
        setLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) return; 

    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'saas_users');
    
    const unsub = onSnapshot(usersRef, (snapshot) => {
        const loadedUsers = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        loadedUsers.sort((a: any, b: any) => (b.created_at || 0) - (a.created_at || 0));
        
        if (loadedUsers.length > 0) setManagedUsers(loadedUsers);
        else {
            setManagedUsers([{ id: 'default-admin', name: 'System Admin', email: 'admin@trafficflow.io', role: 'Admin', status: 'Active', created_at: Date.now() }]);
        }
    }, (error) => {
        console.warn("Firestore access restricted or not ready:", error.message);
    });
    
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const boot = async () => {
      if (proxies.length === 0) {
        const mockProxies = Array.from({ length: 15 }, (_, i) => ({
          id: `proxy-${i}`,
          address: `${Math.floor(Math.random()*200+50)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}:8080`,
          source: 'System',
          latency: Math.floor(Math.random() * 500),
          status: 'active'
        }));
        setProxies(mockProxies);
      }
      if (logs.length === 0) {
        setLogs([{ id: `log-init`, message: 'System initialized successfully', timestamp: new Date(), type: 'info' }]);
      }
    };
    boot();
  }, []);

  const getMockIP = (countryCode: string) => {
    const codes = IP_PREFIXES[countryCode] || IP_PREFIXES['US'];
    const prefix = codes[Math.floor(Math.random() * codes.length)];
    return `${prefix}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
  };

  const sendGA4Hit = (payload: any, hitCid: string, hitSid: any, eventName = 'page_view', extraParams: any = {}) => {
// ... existing sendGA4Hit code ...
    if (!payload || !payload.ga4Id) return;

    const cid = hitCid;
    const sid = hitSid;
    
    let source = 'trafficflow'; 
    let medium = 'referral';
    let referrer = undefined;
    
    const tType = (payload.trafficType || '').toLowerCase();
    
    // --- UPDATED ATTRIBUTION LOGIC (v17.4) ---
    if (tType.includes('organic')) {
        let engine = 'google';
        if (tType === 'organic') {
             const engines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex', 'naver', 'ecosia', 'sogou', 'brave', 'petal', 'kvasir'];
             engine = engines[Math.floor(Math.random() * engines.length)];
        } else {
             engine = tType.replace('organic_', '');
        }
        source = engine;
        medium = 'organic';
        referrer = ReferrerManager.getOrganicSearch(engine, payload.entryPoint || 'keyword');
    } else if (tType.startsWith('social') || tType === 'social') {
        let platform = 'facebook';
        if (tType === 'social') {
             const platforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'pinterest', 'reddit', 'quora'];
             platform = platforms[Math.floor(Math.random() * platforms.length)];
        } else {
             platform = tType.replace('social_', '');
        }
        source = platform;
        medium = 'social';
        referrer = ReferrerManager.getSocial(platform);
    } else if (tType.startsWith('ai_')) {
        let engine = 'chatgpt';
        if (tType === 'ai_organic_mix') {
            const ais = ['chatgpt', 'gemini', 'claude', 'perplexity', 'copilot'];
            engine = ais[Math.floor(Math.random() * ais.length)];
        } else {
            engine = tType.replace('ai_', '');
        }
        source = engine;
        medium = 'ai_referral';
        referrer = ReferrerManager.getAISearch(engine);
    } else if (tType.startsWith('local_')) {
        let app = 'google_maps';
        if (tType === 'local_discovery') {
            const apps = ['google_maps', 'apple_maps', 'waze', 'yelp', 'tripadvisor', 'foursquare', 'bing_maps'];
            app = apps[Math.floor(Math.random() * apps.length)];
        } else {
            app = tType.replace('local_', '');
        }
        source = app;
        medium = 'organic_local';
        referrer = ReferrerManager.getLocalDiscovery(app, payload.entryPoint || payload.targeting?.city);
    } else if (tType.includes('direct')) {
        source = '(direct)';
        medium = '(none)'; 
    } else if (tType === 'custom') { 
        source = payload.customSource || 'custom';
        medium = payload.customMedium || 'custom';
        referrer = payload.customReferrer;
    }

    const mockIP = getMockIP(payload.targeting?.countryCode);
    const dynamicTitle = formatUrlToTitle(payload.url, payload.name);

    // --- FIX: FORCE ATTRIBUTION IN DL PARAM ---
    const safeUrl = payload.url || 'https://example.com';
    let documentLocation = safeUrl;
    try {
        const urlObj = new URL(safeUrl);
        urlObj.searchParams.set('utm_source', source);
        urlObj.searchParams.set('utm_medium', medium);
        urlObj.searchParams.set('utm_campaign', payload.name);
        if(payload.id) urlObj.searchParams.set('utm_id', payload.id);
        documentLocation = urlObj.toString();
    } catch(e) {
        const sep = safeUrl.includes('?') ? '&' : '?';
        documentLocation = `${safeUrl}${sep}utm_source=${source}&utm_medium=${medium}&utm_campaign=${encodeURIComponent(payload.name)}`;
    }

    const safeExtraParams = Object.entries(extraParams).reduce((acc: any, [key, val]) => {
      acc[key] = String(val);
      return acc;
    }, {});

    const params = new URLSearchParams({
      v: '2', 
      tid: payload.ga4Id, 
      cid: String(cid), 
      sid: String(sid), 
      en: eventName, 
      dl: documentLocation, 
      dr: referrer || '', 
      dt: dynamicTitle,
      ul: payload.ul || 'en-us', 
      cs: source, 
      cm: medium, 
      cn: payload.name || '(not set)', 
      'ep.source': source, 
      'ep.medium': medium, 
      'ep.campaign': payload.name || '(not set)',
      uip: mockIP, 
      _uip: mockIP, 
      _et: String(Math.floor(Math.random() * 5000) + 100), 
      seg: '1', 
      _p: String(Math.floor(Math.random() * 1000000)),
      ...safeExtraParams 
    });

    if (eventName === 'page_view') {
        params.append('_ss', '1');
        params.append('_fv', '1');
    }

    const trackingUrl = `https://www.google-analytics.com/g/collect?${params.toString()}`;
    if (navigator.sendBeacon) { navigator.sendBeacon(trackingUrl); } 
    else { fetch(trackingUrl, { mode: 'no-cors', method: 'POST' }).catch(() => {}); }
  };

  useEffect(() => {
    if (!isEngineRunning) {
      clearTimeout(engineTimerRef.current);
      setCurrentJob(null);
      return;
    }

    const runEngineLoop = () => {
       const currentCampaigns = campaignsRef.current;
       const active = currentCampaigns.filter(c => c.status === 'active');
       
       if (active.length === 0) {
           engineTimerRef.current = setTimeout(runEngineLoop, 1000);
           return;
       }

       const now = new Date();
       const currentHour = now.getHours();
       const currentMinute = now.getMinutes();
       
       const eligibleJobs = active.filter(job => {
           if (!job.scheduleStart || !job.scheduleEnd) return true; 
           
           const [startH, startM] = job.scheduleStart.split(':').map(Number);
           const [endH, endM] = job.scheduleEnd.split(':').map(Number);
           
           const currentTotal = currentHour * 60 + currentMinute;
           const startTotal = startH * 60 + startM;
           const endTotal = endH * 60 + endM;
           
           return currentTotal >= startTotal && currentTotal < endTotal;
       });

       if (eligibleJobs.length === 0) {
           engineTimerRef.current = setTimeout(runEngineLoop, 5000);
           return;
       }

       const job = eligibleJobs[Math.floor(Math.random() * eligibleJobs.length)];
       
       if (!job || !job.urls || job.urls.length === 0) {
           engineTimerRef.current = setTimeout(runEngineLoop, 1000);
           return;
       }

       const url = job.urls[Math.floor(Math.random() * job.urls.length)];
       const hitCid = 'cli-' + Math.random().toString(36).substring(2, 9);
       const hitSid = Date.now();

       let entryKeyword = null;
       let baseKeyword = null;
       
       if (job.keywords && Array.isArray(job.keywords) && job.keywords.length > 0) {
           baseKeyword = job.keywords[Math.floor(Math.random() * job.keywords.length)];
       } else if (typeof job.keywords === 'string' && job.keywords.trim() !== "") {
           baseKeyword = job.keywords;
       }

       if (baseKeyword) {
          if (job.trafficType.includes('local')) {
             entryKeyword = ReferrerManager.getLocalIntent(baseKeyword, job.targeting?.city);
          } else if (job.trafficType.includes('organic')) {
             entryKeyword = ReferrerManager.getLSIVariation(baseKeyword);
          } else {
             entryKeyword = baseKeyword;
          }
       }

       const fingerprint = FingerprintRotator.getRandomProfile(job.targetOS, job.targeting?.countryCode);
       const techParams = { 
           vp: fingerprint.vp, 
           sd: fingerprint.sd, 
           ul: fingerprint.ul 
       };
       const hitPayload = { ...job, url, entryPoint: entryKeyword, ...fingerprint };

       // --- HUMAN BEHAVIOR SEQUENCE ---
       // 1. Initial Page View
       sendGA4Hit(hitPayload, hitCid, hitSid, 'page_view', { ...techParams });
       
       // 2. Random Scroll (3s - 8s delay)
       const scrollDelay = 3000 + Math.random() * 5000;
       setTimeout(() => sendGA4Hit(hitPayload, hitCid, hitSid, 'scroll', { "ep.percent_scrolled": 25 + Math.floor(Math.random()*50), ...techParams }), scrollDelay);
       
       // 3. User Engagement (15s delay)
       setTimeout(() => sendGA4Hit(hitPayload, hitCid, hitSid, 'user_engagement', { "_et": 15000 + Math.floor(Math.random()*20000), ...techParams }), 15000); 

       const ifr = document.createElement('iframe');
       ifr.src = url;
       ifr.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;visibility:hidden;";
       ifr.setAttribute('sandbox', 'allow-same-origin allow-forms'); 
       iframeContainerRef.current?.appendChild(ifr);
       setTimeout(() => { if(ifr.parentNode) ifr.parentNode.removeChild(ifr); }, 5000);

       if (!document.hidden) {
           setCurrentJob({ campaign: job.name, url: url, flag: job.targeting?.countryCode, entryPoint: entryKeyword });

           const entryText = entryKeyword ? `via "${entryKeyword}"` : `via ${trafficMode.toUpperCase()} ROUTE`;
           const newLog = { id: `log-${Date.now()}`, message: `HIT: ${new URL(url).hostname} [${job.targeting?.countryCode}] ${entryText}`, timestamp: new Date(), type: 'success' };
           
           setLogs(prev => [newLog, ...prev].slice(0, 50));

           setAnalyticsData(prev => {
             const newData = { ...prev };
             const tType = (job.trafficType || '').toLowerCase();
             let expectedSource = 'organic';
             if (tType.includes('social')) expectedSource = 'social';
             else if (tType.includes('ai')) expectedSource = 'ai_referral';
             else if (tType.includes('local')) expectedSource = 'local';
             
             newData.sources[expectedSource] = (newData.sources[expectedSource] || 0) + 1;
             newData.events['page_view'] = (newData.events['page_view'] || 0) + 1;
             newData.audience.allUsers += 1;
             return newData;
           });
       }

       setCampaigns(prev => prev.map(c => c.id === job.id ? { ...c, stats: { ...c.stats, hits: (c.stats.hits || 0) + 1 } } : c));

       let delay = 1000;
       if (trafficMode === 'optimal') delay = 200;
       if (trafficMode === 'stealth') delay = 2000 + Math.random() * 1500;
       engineTimerRef.current = setTimeout(runEngineLoop, delay);
    };

    runEngineLoop();

    return () => clearTimeout(engineTimerRef.current);
  }, [isEngineRunning, trafficMode]);

  const toggleCampaignStatus = (campaign: any) => { setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c)); };

  // --- V17.4 REAL-TIME AUTO SCRAPER HANDLER ---
  const handleAutoScrape = useCallback(async () => {
    if (!scrapeUrl) return;
    setIsScrapingSite(true);
    setScrapingProgress(5);
    setScrapeLogs(['Initializing Crawler v17.4...']);
    setScrapedData({ urls: [], keywords: [], pasf: [], niche: '' });

    // Helper to update logs safely
    const addLog = (msg: string) => setScrapeLogs(prev => [...prev, msg]);

    try {
        // Step 1: Connect
        setScrapingProgress(20);
        const crawlResult = await ScraperEngine.deepCrawl(scrapeUrl, addLog);
        
        if (!crawlResult || crawlResult.urls.length === 0) {
            // Even if crawlResult exists, if urls are empty it might be a block or SPA issue
            if(!crawlResult) {
                addLog('ERROR: Could not scrape target. Verify domain or try again.');
                addToast("Scrape Failed - Network Block", "error");
            } else {
                addLog('WARNING: No valid internal links found. SPA or Block detected.');
            }
            
            // Keep the empty result state visible so the warning UI shows up
            setIsScrapingSite(false);
            return;
        }

        const { urls, keywords, questions, niche } = crawlResult;
        
        setScrapingProgress(70);
        addLog(`Crawled ${urls.length} internal pages successfully.`);
        addLog(`Extracted ${keywords.length} high-density keywords.`);

        // Step 2: PASF Generation based on REAL content & Live SERP
        setScrapingProgress(85);
        addLog('Querying Live SERP & Content Questions...');
        
        // 1. Get Questions from Content (Highest Quality)
        let finalPASF = [...questions];

        // 2. Enhance with Real Google Autocomplete (Live SERP Data)
        if (keywords.length > 0) {
             const topKw = keywords[0];
             const suggestions = await SERPEngine.fetchRealSuggestions(topKw, ScraperEngine.PROXY_BASE);
             // Filter suggestions to questions only
             const questionSuggestions = suggestions.filter(s => s.startsWith('what') || s.startsWith('how') || s.startsWith('why') || s.includes('?'));
             finalPASF = [...new Set([...finalPASF, ...questionSuggestions])];
        }
        
        setScrapedData({ urls, keywords, pasf: finalPASF.slice(0, 10), niche });
        setScrapingProgress(100);
        addLog('Deep Scrape Workflow Completed.');
        
        addToast(`Success: Found ${urls.length} URLs & ${keywords.length} Keywords`, "success");
    } catch (e) {
        addLog(`Critical Error: ${e}`);
        addToast("Scraping Failed", "error");
    } finally {
        setIsScrapingSite(false);
    }
  }, [scrapeUrl]);

  const handleSaveCampaign = (e: React.FormEvent<HTMLFormElement>) => {
// ... existing handleSaveCampaign code ...
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keywordsVal = formData.get('keywords') as string;
    const keywordsArray = keywordsVal ? keywordsVal.split('\n').filter(k => k.trim()) : [];
    
    // Merge scraped keywords if present and not duplicate
    const mergedKeywords = Array.from(new Set([...keywordsArray, ...scrapedData.keywords]));
    
    const pasfVal = formData.get('pasfKeywords') as string;
    const pasfArray = pasfVal ? pasfVal.split('\n').filter(k => k.trim()) : [];
    const mergedPASF = Array.from(new Set([...pasfArray, ...scrapedData.pasf]));

    const selContinent = (formData.get('continent') as string) || selectedContinent;
    const selCountryName = formData.get('country') as string; 
    let resolvedCode = selectedCountryCode;
    if (selContinent && selCountryName && CONTINENT_DATA[selContinent]) {
        const countryObj = CONTINENT_DATA[selContinent].find(c => c.name === selCountryName);
        if (countryObj) resolvedCode = countryObj.code;
    }
    const trafficType = formData.get('trafficType') as string;
    
    // Merge Scraped URLs with Textarea URLs
    const urlsRaw = formData.get('urls') as string;
    const manualUrls = urlsRaw ? urlsRaw.split('\n').filter(u => u) : [];
    // Ensure we use the object structure for scrapedUrls if available, or just strings for manual
    const finalUrls = Array.from(new Set([...manualUrls, ...scrapedData.urls.map(u => u.url)]));

    const newCamp = {
      id: editingCampaign ? editingCampaign.id : `camp-${Date.now()}`,
      name: formData.get('name') as string,
      status: editingCampaign ? editingCampaign.status : 'paused',
      trafficType: trafficType,
      customSource: trafficType === 'custom' ? formData.get('customSource') : undefined,
      customMedium: trafficType === 'custom' ? formData.get('customMedium') : undefined,
      customReferrer: formData.get('customReferrer'),
      
      urls: finalUrls,
      scrapedUrls: scrapedData.urls, // Persist structured data
      targeting: { continent: selContinent, countryCode: resolvedCode, city: formData.get('city') },
      ga4Id: formData.get('ga4Id'),
      keywords: mergedKeywords,
      pasfKeywords: mergedPASF,
      minTime: parseInt(formData.get('minTime') as string) || 30,
      maxTime: parseInt(formData.get('maxTime') as string) || 60,
      pageDepth: parseInt(formData.get('pageDepth') as string) || 2,
      dailyVolume: parseInt(formData.get('volume') as string) || 1000,
      bounceRate: parseInt(formData.get('bounceRate') as string) || 45,
      conversionRate: parseInt(formData.get('conversionRate') as string) || 3,
      trafficPattern: formData.get('trafficPattern'),
      ecommerceMode: formData.get('ecommerceMode') === 'on',
      useProxies: formData.get('useProxies') === 'on',
      businessHoursOnly: formData.get('businessHoursOnly') === 'on',
      returningVisitors: formData.get('returningVisitors') === 'on',
      targetOS: formData.get('targetOS'),
      scheduleStart: formData.get('scheduleStart'),
      scheduleEnd: formData.get('scheduleEnd'),
      stats: editingCampaign?.stats || { hits: 0 }
    };
    if (editingCampaign) { setCampaigns(prev => prev.map(c => c.id === newCamp.id ? newCamp : c)); } 
    else { setCampaigns(prev => [...prev, newCamp]); }
    addToast(editingCampaign ? "Campaign Updated" : "New Campaign Created", "success");
    setShowNewCampaignModal(false); 
    setEditingCampaign(null);
    setScrapedData({ urls: [], keywords: [], pasf: [], niche: '' }); // Reset
    setScrapeLogs([]);
  };

  const handleDownloadReport = (campaign: any) => {
    addToast("Report Downloaded Successfully", "success");
  };
  
  const exportCampaigns = () => {
    const blob = new Blob([JSON.stringify(campaigns, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tf-v17.4-ent-backup.json`;
    a.click();
    addToast("Backup Exported", "success");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPasswordInput('');
      addToast("Admin Access Granted", "success");
    } else {
      addToast("Invalid Admin Password", "error");
    }
  };

  const handleAddUser = (userData: any) => {
    const newUser = { ...userData, id: `user-${Date.now()}`, created_at: Date.now(), lastActive: Date.now() };
    setManagedUsers(prev => [newUser, ...prev]);
    addToast("User Added", "success");
  };

  const handleEditUser = (userData: any) => {
    setManagedUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    addToast("User Updated", "success");
  };

  const handleDeleteUser = (id: string) => {
    setManagedUsers(prev => prev.filter(u => u.id !== id));
    addToast("User Deleted", "success");
  };

  const handleResetPassword = (id: string) => addToast("Reset Link Sent", "info");

  const scrapeProxiesFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setScrapping(true);
    setTimeout(() => {
        const scraped = Array.from({ length: 5 }, (_, i) => ({ id: `scraped-${Date.now()}-${i}`, address: `scraped.proxy.${i}:8080`, source: 'Web', latency: 120, status: 'active' }));
        setProxies(prev => [...prev, ...scraped]);
        setScrapping(false);
        addToast("Scraped 5 new proxies", "success");
    }, 1500);
  };

  const handleExtensionScrape = () => {
      addToast("Extension Sync Started", "info");
      setTimeout(() => {
          const newProxies = Array.from({ length: 10 }, (_, i) => ({ 
              id: `ext-proxy-${Date.now()}-${i}`, 
              address: `192.168.1.${100+i}:8080`, 
              source: 'Extension', 
              latency: Math.floor(Math.random() * 200), 
              status: 'active' 
          }));
          setProxies(prev => [...prev, ...newProxies]);
          addToast("Extension Sync Complete: 10 Proxies Added", "success");
      }, 1500);
  };

  const handleCreateApiKey = () => {
      setApiKeys(prev => [...prev, { id: `key-${Date.now()}`, key: `tf_live_${Math.random().toString(36).substr(2,9)}`, name: 'New Key', created: Date.now(), status: 'active' }]);
      addToast("API Key Generated", "success");
  };

  const handleRevokeApiKey = (id: string) => {
      setApiKeys(prev => prev.filter(k => k.id !== id));
      addToast("API Key Revoked", "warning");
  };

  const handleImportCampaigns = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  const imported = JSON.parse(event.target?.result as string);
                  if(Array.isArray(imported)) {
                      // Map fields to ensure v17.4 compatibility
                      const sanitized = imported.map((c: any) => ({
                          ...c,
                          scrapedUrls: c.scrapedUrls || [],
                          keywords: c.keywords || [],
                          pasfKeywords: c.pasfKeywords || []
                      }));
                      setCampaigns(prev => [...prev, ...sanitized]);
                      addToast(`Imported ${imported.length} Campaigns Successfully`, "success");
                  } else {
                      addToast("Invalid File Format", "error");
                  }
              } catch (err) {
                  addToast("Failed to parse JSON", "error");
              }
          };
          reader.readAsText(file);
      }
  };

  if (loading) return <SkeletonDashboard />;

  if (!user && showLogin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block p-4 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30"><Zap size={40} /></div>
                    <h2 className="text-3xl font-bold tracking-tight">TrafficFlow Enterprise</h2>
                    <p className="mt-2 text-slate-400">Sign in to access your traffic control center.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
                    <button onClick={() => { 
                        setUser({ uid: 'mock-user', email: 'admin@trafficflow.io', displayName: 'Enterprise Admin' });
                        setShowLogin(false);
                    }} className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-100 transition-all">
                        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-10 text-blue-600 dark:text-blue-400">
                    <Zap size={28} className="fill-current" />
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TrafficFlow</span>
                </div>
                
                <nav className="space-y-2 flex-1">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={Activity} label="Campaigns" active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} />
                    <SidebarItem icon={Server} label="Proxies" active={activeTab === 'proxies'} onClick={() => setActiveTab('proxies')} />
                    <SidebarItem icon={UserIcon} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarItem icon={Terminal} label="Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors w-full">
                        <Settings size={18} /> <span className="text-sm font-medium">Settings</span>
                    </button>
                </div>
            </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 relative">
             <div ref={iframeContainerRef}></div> {/* Hidden iframe container */}
             <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center">
                 <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                 <div className="flex items-center gap-4">
                     <button onClick={() => setIsEngineRunning(!isEngineRunning)} className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${isEngineRunning ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 text-slate-600'}`}>
                        {isEngineRunning ? <Pause size={16}/> : <Play size={16}/>}
                        {isEngineRunning ? 'Engine Active' : 'Engine Idle'}
                     </button>
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user?.displayName?.charAt(0) || 'A'}
                     </div>
                 </div>
             </div>

             <div className="p-8">
                {activeTab === 'dashboard' && <DashboardTab stats={analyticsData} campaigns={campaigns} isRunning={isEngineRunning} />}
                {activeTab === 'campaigns' && <CampaignsTab campaigns={campaigns} onToggle={toggleCampaignStatus} onEdit={(c:any)=>{setEditingCampaign(c); setShowEditCampaignModal(true);}} onDelete={(id:string)=>setCampaigns(prev=>prev.filter(c=>c.id!==id))} onNew={()=>setShowNewCampaignModal(true)} />}
                {activeTab === 'proxies' && <ProxiesTab proxies={proxies} setProxies={setProxies} scrapping={scrapping} onScrape={scrapeProxiesFromUrl} onDeleteAll={()=>setProxies([])} onExtensionScrape={handleExtensionScrape} />}
                {activeTab === 'users' && <UsersTab users={managedUsers} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} onResetPassword={handleResetPassword} />}
                {activeTab === 'logs' && <LogsTab logs={logs} />}
             </div>
        </main>

        <CampaignModal 
            isOpen={showNewCampaignModal || showEditCampaignModal} 
            onClose={() => {setShowNewCampaignModal(false); setShowEditCampaignModal(false);}} 
            onSubmit={handleSaveCampaign} 
            campaign={editingCampaign}
            scrapeUrl={scrapeUrl}
            onScrapeUrlChange={setScrapeUrl}
            onAutoScrape={handleAutoScrape}
            isScrapingSite={isScrapingSite}
            scrapingProgress={scrapingProgress}
            scrapeLogs={scrapeLogs}
            scrapedData={scrapedData}
        />

        <CommandPalette isOpen={showCmdPalette} onClose={() => setShowCmdPalette(false)} onNavigate={setActiveTab} actions={[]} />
        <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} logs={logs} proxies={proxies} campaigns={campaigns} />
        <ApiManagerModal isOpen={showApiModal} onClose={() => setShowApiModal(false)} apiKeys={apiKeys} onCreate={handleCreateApiKey} onRevoke={handleRevokeApiKey} />
        
        <div className="fixed bottom-4 left-4 z-50">
             <SessionReplayFeed isRunning={isEngineRunning} />
        </div>
    </div>
  );
};

export const App = () => (
    <ErrorBoundary>
        <ToastProvider>
            <MainContent />
        </ToastProvider>
    </ErrorBoundary>
);

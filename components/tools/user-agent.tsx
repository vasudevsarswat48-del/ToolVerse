'use client';

import { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Monitor, Smartphone, Tablet, RefreshCw, Cpu, Globe, DisplayGrid, ShieldAlert } from 'lucide-react';

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown';
  engine: string;
}

export default function UserAgentTool() {
  const [currentUa, setCurrentUa] = useState<string>('');
  const [customUa, setCustomUa] = useState<string>('');
  const [screenInfo, setScreenInfo] = useState({
    screenSize: '',
    viewportSize: '',
    devicePixelRatio: 1,
    colorDepth: 24,
    language: '',
    timeZone: '',
    touchSupport: false,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      setCurrentUa(ua);
      setCustomUa(ua);

      setScreenInfo({
        screenSize: `${window.screen.width} × ${window.screen.height}`,
        viewportSize: `${window.innerWidth} × ${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth || 24,
        language: navigator.language || 'en-US',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
    }
  }, []);

  const activeUaString = customUa.trim() || currentUa;

  // Simple, lightweight UA Parser
  const parsed: ParsedUA = useMemo(() => {
    if (!activeUaString) {
      return {
        browser: { name: 'Unknown', version: '' },
        os: { name: 'Unknown', version: '' },
        deviceType: 'Unknown',
        engine: 'Unknown',
      };
    }

    const ua = activeUaString;

    // Device Type
    let deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown' = 'Desktop';
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      deviceType = 'Tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
      deviceType = 'Mobile';
    }

    // Engine
    let engine = 'Unknown';
    if (/WebKit/i.test(ua) && !/Edge|Edg/i.test(ua)) engine = 'WebKit';
    if (/Blink/i.test(ua) || (/Chrome/i.test(ua) && /AppleWebKit/i.test(ua))) engine = 'Blink';
    if (/Gecko/i.test(ua) && !/like Gecko/i.test(ua)) engine = 'Gecko';
    if (/Trident/i.test(ua)) engine = 'Trident';

    // Operating System
    let osName = 'Unknown';
    let osVer = '';

    if (/Windows NT 10.0/i.test(ua)) {
      osName = 'Windows';
      osVer = '10 / 11';
    } else if (/Windows NT 6.3/i.test(ua)) {
      osName = 'Windows';
      osVer = '8.1';
    } else if (/Windows NT 6.1/i.test(ua)) {
      osName = 'Windows';
      osVer = '7';
    } else if (/Android/i.test(ua)) {
      osName = 'Android';
      const match = ua.match(/Android\s([0-9\.]+)/i);
      osVer = match ? match[1] : '';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      osName = 'iOS';
      const match = ua.match(/OS\s([0-9_]+)/i);
      osVer = match ? match[1].replace(/_/g, '.') : '';
    } else if (/Mac OS X/i.test(ua)) {
      osName = 'macOS';
      const match = ua.match(/Mac OS X\s([0-9_]+)/i);
      osVer = match ? match[1].replace(/_/g, '.') : '';
    } else if (/Linux/i.test(ua)) {
      osName = 'Linux';
    }

    // Browser
    let browserName = 'Unknown';
    let browserVer = '';

    if (/Edg\//i.test(ua)) {
      browserName = 'Microsoft Edge';
      browserVer = ua.match(/Edg\/([0-9\.]+)/i)?.[1] || '';
    } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
      browserName = 'Opera';
      browserVer = ua.match(/(?:OPR|Opera)\/([0-9\.]+)/i)?.[1] || '';
    } else if (/Chrome\//i.test(ua)) {
      browserName = 'Google Chrome';
      browserVer = ua.match(/Chrome\/([0-9\.]+)/i)?.[1] || '';
    } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
      browserName = 'Safari';
      browserVer = ua.match(/Version\/([0-9\.]+)/i)?.[1] || '';
    } else if (/Firefox\//i.test(ua)) {
      browserName = 'Mozilla Firefox';
      browserVer = ua.match(/Firefox\/([0-9\.]+)/i)?.[1] || '';
    }

    return {
      browser: { name: browserName, version: browserVer },
      os: { name: osName, version: osVer },
      deviceType,
      engine,
    };
  }, [activeUaString]);

  const handleCopy = async () => {
    if (!activeUaString) return;
    await navigator.clipboard.writeText(activeUaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToCurrent = () => {
    setCustomUa(currentUa);
  };

  const getDeviceIcon = () => {
    if (parsed.deviceType === 'Mobile') return <Smartphone className="w-5 h-5 text-cyan-400" />;
    if (parsed.deviceType === 'Tablet') return <Tablet className="w-5 h-5 text-cyan-400" />;
    return <Monitor className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>User Agent & Client Environment Inspector</span>
        </div>

        <button
          onClick={handleResetToCurrent}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset to My Device
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Browser */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Browser</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-100">{parsed.browser.name}</p>
            <p className="text-xs font-mono text-cyan-400">
              {parsed.browser.version ? `v${parsed.browser.version}` : 'Version N/A'}
            </p>
          </div>
        </div>

        {/* Operating System */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">OS</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-100">{parsed.os.name}</p>
            <p className="text-xs font-mono text-emerald-400">
              {parsed.os.version ? `v${parsed.os.version}` : 'Build N/A'}
            </p>
          </div>
        </div>

        {/* Device Type */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Device Form</span>
            {getDeviceIcon()}
          </div>
          <div>
            <p className="text-base font-bold text-slate-100">{parsed.deviceType}</p>
            <p className="text-xs font-mono text-indigo-400">Engine: {parsed.engine}</p>
          </div>
        </div>

        {/* Viewport & Screen */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Screen / Viewport</span>
            <DisplayGrid className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-100">Screen: {screenInfo.screenSize || 'N/A'}</p>
            <p className="text-xs font-mono text-amber-400">View: {screenInfo.viewportSize || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Raw UA String & Inspector Box */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            User Agent String (Editable Test Input)
          </label>
          <button
            onClick={handleCopy}
            disabled={!activeUaString}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied UA!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Raw UA
              </>
            )}
          </button>
        </div>

        <textarea
          value={customUa}
          onChange={(e) => setCustomUa(e.target.value)}
          placeholder="Paste custom User-Agent string to parse..."
          className="w-full h-28 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-cyan-300 font-mono text-xs focus:outline-none resize-none transition leading-relaxed"
        />
      </div>

      {/* Extended Client Features & Screen Properties */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Client System Properties
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Language</span>
            <p className="text-slate-200 truncate">{screenInfo.language || 'Unknown'}</p>
          </div>

          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Timezone</span>
            <p className="text-slate-200 truncate">{screenInfo.timeZone || 'Unknown'}</p>
          </div>

          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Pixel Ratio</span>
            <p className="text-slate-200">{screenInfo.devicePixelRatio}x</p>
          </div>

          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Color Depth</span>
            <p className="text-slate-200">{screenInfo.colorDepth}-bit</p>
          </div>

          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Touch Screen</span>
            <p className={screenInfo.touchSupport ? 'text-emerald-400' : 'text-slate-400'}>
              {screenInfo.touchSupport ? 'Supported' : 'No Touch'}
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-sans block">Cookies Enabled</span>
            <p className="text-emerald-400">
              {typeof navigator !== 'undefined' && navigator.cookieEnabled ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

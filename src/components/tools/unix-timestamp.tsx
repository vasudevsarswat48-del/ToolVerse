'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Copy,
  Check,
  Play,
  Pause,
  Calendar,
  ArrowRightLeft,
  Trash2,
  Sparkles,
  Globe,
  RefreshCw,
} from 'lucide-react';

function formatRelativeTime(targetDate: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 5) return 'just now';

  const units: { label: string; seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const u of units) {
    const count = Math.floor(absDiff / u.seconds);
    if (count >= 1) {
      const plural = count > 1 ? 's' : '';
      return diffInSeconds > 0 ? `in ${count} ${u.label}${plural}` : `${count} ${u.label}${plural} ago`;
    }
  }

  return targetDate.toLocaleString();
}

export default function UnixTimestampTool() {
  const [now, setNow] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState<boolean>(true);

  // Timestamp -> Date State
  const [tsInput, setTsInput] = useState<string>('');

  // Date -> Timestamp State
  const [dateInput, setDateInput] = useState<string>('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Clock Ticker
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Set default values on client mount
  useEffect(() => {
    const currentTs = Math.floor(Date.now() / 1000).toString();
    setTsInput(currentTs);

    const localIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateInput(localIso);
  }, []);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Timestamp to Date calculations
  const parsedTsNumber = Number(tsInput.trim());
  let convertedDateFromTs: Date | null = null;
  let isTsInMilliseconds = false;

  if (tsInput.trim() !== '' && !isNaN(parsedTsNumber)) {
    // If timestamp is longer than 11 digits, assume milliseconds
    if (Math.abs(parsedTsNumber) > 99999999999) {
      convertedDateFromTs = new Date(parsedTsNumber);
      isTsInMilliseconds = true;
    } else {
      convertedDateFromTs = new Date(parsedTsNumber * 1000);
    }
  }

  const isValidTsDate = convertedDateFromTs && !isNaN(convertedDateFromTs.getTime());

  // Date to Timestamp calculations
  let convertedTsFromDate: number | null = null;
  if (dateInput) {
    const parsedDate = new Date(dateInput);
    if (!isNaN(parsedDate.getTime())) {
      convertedTsFromDate = Math.floor(parsedDate.getTime() / 1000);
    }
  }

  const handleSetTsToNow = () => {
    setTsInput(Math.floor(Date.now() / 1000).toString());
  };

  const handleSetDateToNow = () => {
    const localIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDateInput(localIso);
  };

  const handlePresetOffset = (offsetSeconds: number) => {
    const futureTs = Math.floor(Date.now() / 1000) + offsetSeconds;
    setTsInput(futureTs.toString());
  };

  const currentSeconds = Math.floor(now.getTime() / 1000);
  const currentMillis = now.getTime();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Unix Timestamp & Date Converter</span>
        </div>

        <button
          onClick={() => {
            setTsInput('');
            setDateInput('');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Live Current Epoch Hero Card */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Current Live Unix Epoch
          </span>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border transition ${
              isLive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live Ticking' : 'Paused'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seconds Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Seconds (10-Digit)
              </span>
              <button
                onClick={() => handleCopy(currentSeconds.toString(), 'live-sec')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedKey === 'live-sec' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy
              </button>
            </div>
            <p className="text-2xl font-bold font-mono text-cyan-400">{currentSeconds}</p>
          </div>

          {/* Milliseconds Card */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Milliseconds (13-Digit)
              </span>
              <button
                onClick={() => handleCopy(currentMillis.toString(), 'live-ms')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedKey === 'live-ms' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy
              </button>
            </div>
            <p className="text-2xl font-bold font-mono text-slate-200">{currentMillis}</p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <span>UTC: {now.toUTCString()}</span>
          <span>Local: {now.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Conversion Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp -> Human Date */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" /> Timestamp to Date
            </span>

            <button
              onClick={handleSetTsToNow}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
            >
              <RefreshCw className="w-3 h-3" /> Set to Now
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder="e.g. 1700000000 or 1700000000000"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-sm focus:outline-none transition"
            />

            {/* Quick Offset Buttons */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <button
                onClick={() => handlePresetOffset(3600)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 rounded transition"
              >
                +1 Hour
              </button>
              <button
                onClick={() => handlePresetOffset(86400)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 rounded transition"
              >
                +1 Day
              </button>
              <button
                onClick={() => handlePresetOffset(604800)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 rounded transition"
              >
                +7 Days
              </button>
              <button
                onClick={() => handlePresetOffset(31536000)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 rounded transition"
              >
                +1 Year
              </button>
            </div>
          </div>

          {/* Result Output List */}
          {isValidTsDate && convertedDateFromTs ? (
            <div className="space-y-2 pt-2">
              {isTsInMilliseconds && (
                <p className="text-[11px] text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  Detected: 13-Digit Milliseconds Timestamp
                </p>
              )}

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">GMT / UTC:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-semibold">
                      {convertedDateFromTs.toUTCString()}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(convertedDateFromTs!.toUTCString(), 'utc-date')
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'utc-date' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Local Time:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-semibold">
                      {convertedDateFromTs.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(convertedDateFromTs!.toLocaleString(), 'local-date')
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'local-date' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">ISO 8601:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-semibold">
                      {convertedDateFromTs.toISOString()}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(convertedDateFromTs!.toISOString(), 'iso-date')
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'iso-date' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Relative:</span>
                  <span className="text-cyan-400 font-semibold">
                    {formatRelativeTime(convertedDateFromTs)}
                  </span>
                </div>
              </div>
            </div>
          ) : tsInput ? (
            <p className="text-xs text-rose-400 font-mono italic">Invalid Timestamp</p>
          ) : null}
        </div>

        {/* Human Date -> Timestamp */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date to Timestamp
            </span>

            <button
              onClick={handleSetDateToNow}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition"
            >
              <RefreshCw className="w-3 h-3" /> Set to Now
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 block">Select Date & Local Time</label>
            <input
              type="datetime-local"
              step="1"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 font-mono text-sm focus:outline-none transition"
            />
          </div>

          {/* Output Results */}
          {convertedTsFromDate !== null ? (
            <div className="space-y-2 pt-2">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Unix Seconds:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold font-mono">
                      {convertedTsFromDate}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(convertedTsFromDate!.toString(), 'ts-sec')
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'ts-sec' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Unix Milliseconds:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-bold font-mono">
                      {convertedTsFromDate * 1000}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy((convertedTsFromDate! * 1000).toString(), 'ts-ms')
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedKey === 'ts-ms' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : dateInput ? (
            <p className="text-xs text-rose-400 font-mono italic">Invalid Date Input</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Trash2,
  Terminal,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface CronPreset {
  expression: string;
  label: string;
  description: string;
}

const CRON_PRESETS: CronPreset[] = [
  {
    expression: '* * * * *',
    label: 'Every Minute',
    description: 'Runs every single minute (* * * * *)',
  },
  {
    expression: '*/5 * * * *',
    label: 'Every 5 Minutes',
    description: 'Runs every 5 minutes (*/5 * * * *)',
  },
  {
    expression: '0 * * * *',
    label: 'Every Hour',
    description: 'Runs at minute 0 of every hour (0 * * * *)',
  },
  {
    expression: '0 0 * * *',
    label: 'Daily at Midnight',
    description: 'Runs at 00:00 every day (0 0 * * *)',
  },
  {
    expression: '0 9 * * 1-5',
    label: 'Weekdays at 9 AM',
    description: 'Runs at 09:00 Mon-Fri (0 9 * * 1-5)',
  },
  {
    expression: '0 0 * * 0',
    label: 'Weekly on Sunday',
    description: 'Runs at midnight every Sunday (0 0 * * 0)',
  },
  {
    expression: '0 0 1 * *',
    label: 'Monthly on 1st',
    description: 'Runs at midnight on the 1st of every month (0 0 1 * *)',
  },
];

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Simple Cron Humanizer Function
function describeCron(expression: string): { summary: string; isValid: boolean } {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { summary: 'Invalid expression: Cron must contain exactly 5 parts', isValid: false };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Basic validation check
  const cronRegex = /^(\*|(\d+|\*)\/\d+|\d+(-\d+)?(,\d+(-\d+)?)*)$/;
  for (const part of parts) {
    if (!cronRegex.test(part)) {
      return { summary: 'Invalid syntax in one or more cron fields', isValid: false };
    }
  }

  const describePart = (part: string, unitSingular: string, unitPlural: string) => {
    if (part === '*') return `every ${unitSingular}`;
    if (part.startsWith('*/')) return `every ${part.replace('*/', '')} ${unitPlural}`;
    if (part.includes(',')) return `at ${unitPlural} ${part}`;
    if (part.includes('-')) return `from ${unitSingular} ${part.replace('-', ' through ')}`;
    return `at ${unitSingular} ${part}`;
  };

  let description = '';

  if (minute === '*' && hour === '*') {
    description = 'At every minute';
  } else if (minute.startsWith('*/') && hour === '*') {
    description = `Every ${minute.replace('*/', '')} minutes`;
  } else if (hour === '*' && minute !== '*') {
    description = `At minute ${minute} of every hour`;
  } else if (hour !== '*' && minute !== '*') {
    const minPadded = minute.padStart(2, '0');
    const hourNum = parseInt(hour, 10);
    if (!isNaN(hourNum)) {
      const timeStr = `${hourNum.toString().padStart(2, '0')}:${minPadded}`;
      description = `At ${timeStr}`;
    } else {
      description = `At hour ${hour}, minute ${minute}`;
    }
  } else {
    description = `At ${describePart(minute, 'minute', 'minutes')}, ${describePart(
      hour,
      'hour',
      'hours'
    )}`;
  }

  if (dayOfMonth !== '*') {
    description += `, on day ${dayOfMonth} of the month`;
  }

  if (month !== '*') {
    const monthNum = parseInt(month, 10);
    const monthLabel = !isNaN(monthNum) && monthNum >= 1 && monthNum <= 12
      ? MONTH_NAMES[monthNum - 1]
      : month;
    description += `, in ${monthLabel}`;
  }

  if (dayOfWeek !== '*') {
    const dowNum = parseInt(dayOfWeek, 10);
    const dowLabel = !isNaN(dowNum) && dowNum >= 0 && dowNum <= 6
      ? DAY_NAMES[dowNum]
      : dayOfWeek;
    description += `, on ${dowLabel}`;
  }

  return { summary: description, isValid: true };
}

// Calculate approximate future execution timestamps
function getNextExecutions(expression: string, count: number = 5): Date[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minPart, hourPart, domPart, monthPart, dowPart] = parts;

  const matchesPart = (val: number, part: string): boolean => {
    if (part === '*') return true;
    if (part.startsWith('*/')) {
      const step = parseInt(part.replace('*/', ''), 10);
      return !isNaN(step) && step > 0 && val % step === 0;
    }
    if (part.includes(',')) {
      return part.split(',').map(Number).includes(val);
    }
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      return val >= start && val <= end;
    }
    return parseInt(part, 10) === val;
  };

  const dates: Date[] = [];
  const current = new Date();
  current.setSeconds(0, 0);

  // Search through max 100,000 minutes (~2.5 months) to avoid infinite loop
  for (let i = 1; i <= 100000 && dates.length < count; i++) {
    const testDate = new Date(current.getTime() + i * 60 * 1000);

    const min = testDate.getMinutes();
    const hour = testDate.getHours();
    const dom = testDate.getDate();
    const month = testDate.getMonth() + 1; // 1-indexed
    const dow = testDate.getDay(); // 0 = Sunday

    if (
      matchesPart(min, minPart) &&
      matchesPart(hour, hourPart) &&
      matchesPart(dom, domPart) &&
      matchesPart(month, monthPart) &&
      matchesPart(dow, dowPart)
    ) {
      dates.push(testDate);
    }
  }

  return dates;
}

export default function CronParserTool() {
  const [expression, setExpression] = useState<string>('*/15 * * * *');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parts = useMemo(() => {
    const split = expression.trim().split(/\s+/);
    return {
      minute: split[0] || '',
      hour: split[1] || '',
      dayOfMonth: split[2] || '',
      month: split[3] || '',
      dayOfWeek: split[4] || '',
    };
  }, [expression]);

  const { summary, isValid } = useMemo(() => describeCron(expression), [expression]);
  const nextRuns = useMemo(() => (isValid ? getNextExecutions(expression, 5) : []), [expression, isValid]);

  const handleFieldChange = (fieldIndex: number, newValue: string) => {
    const split = expression.trim().split(/\s+/);
    while (split.length < 5) split.push('*');
    split[fieldIndex] = newValue || '*';
    setExpression(split.join(' '));
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setExpression('* * * * *');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Cron Schedule Expression Parser & Visualizer</span>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Main Expression Input Hero */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Cron Expression
          </label>
          <button
            onClick={() => handleCopy(expression, 'expr')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            {copiedKey === 'expr' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy
          </button>
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. */15 * * * *"
          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-cyan-400 font-mono text-xl focus:outline-none transition"
        />

        {/* Human Readable Explanation Box */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition ${
            isValid
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              Human Description
            </p>
            <p className="text-sm font-medium">{summary}</p>
          </div>
        </div>
      </div>

      {/* Breakdown by Field */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Expression Breakdown
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Minute */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Minute (0-59)
            </span>
            <input
              type="text"
              value={parts.minute}
              onChange={(e) => handleFieldChange(0, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded text-cyan-300 font-mono text-center font-bold text-base focus:outline-none"
            />
          </div>

          {/* Hour */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Hour (0-23)
            </span>
            <input
              type="text"
              value={parts.hour}
              onChange={(e) => handleFieldChange(1, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded text-cyan-300 font-mono text-center font-bold text-base focus:outline-none"
            />
          </div>

          {/* Day of Month */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Day of Month (1-31)
            </span>
            <input
              type="text"
              value={parts.dayOfMonth}
              onChange={(e) => handleFieldChange(2, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded text-cyan-300 font-mono text-center font-bold text-base focus:outline-none"
            />
          </div>

          {/* Month */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Month (1-12)
            </span>
            <input
              type="text"
              value={parts.month}
              onChange={(e) => handleFieldChange(3, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded text-cyan-300 font-mono text-center font-bold text-base focus:outline-none"
            />
          </div>

          {/* Day of Week */}
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Day of Week (0-6)
            </span>
            <input
              type="text"
              value={parts.dayOfWeek}
              onChange={(e) => handleFieldChange(4, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded text-cyan-300 font-mono text-center font-bold text-base focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Execution Dates */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Next 5 Upcoming Scheduled Runs
        </span>

        {nextRuns.length > 0 ? (
          <div className="space-y-2 font-mono text-xs">
            {nextRuns.map((runDate, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200">{runDate.toLocaleString()}</span>
                </div>
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  {runDate.toUTCString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-mono italic">
            No upcoming runs calculated or expression is invalid.
          </p>
        )}
      </div>

      {/* Presets Table */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> Common Cron Expression Presets
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.expression}
              onClick={() => setExpression(preset.expression)}
              className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                expression === preset.expression
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{preset.label}</span>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {preset.expression}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

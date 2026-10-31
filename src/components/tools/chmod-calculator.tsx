'use client';

import { useState } from 'react';
import {
  Shield,
  Copy,
  Check,
  Terminal,
  Trash2,
  FileCode,
  AlertTriangle,
  Lock,
  Zap,
} from 'lucide-react';

interface PermissionState {
  read: boolean;
  write: boolean;
  execute: boolean;
}

interface RolePermissions {
  user: PermissionState;
  group: PermissionState;
  others: PermissionState;
}

interface SpecialBits {
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
}

interface Preset {
  octal: string;
  label: string;
  description: string;
  user: PermissionState;
  group: PermissionState;
  others: PermissionState;
}

const PRESETS: Preset[] = [
  {
    octal: '644',
    label: '644 - Standard File',
    description: 'Owner read/write, group & public read-only',
    user: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
  },
  {
    octal: '755',
    label: '755 - Executable / Dir',
    description: 'Owner full, group & public read/execute',
    user: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
  },
  {
    octal: '600',
    label: '600 - Private File',
    description: 'Owner read/write only (e.g., SSH keys)',
    user: { read: true, write: true, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
  },
  {
    octal: '700',
    label: '700 - Private Dir',
    description: 'Owner full control only',
    user: { read: true, write: true, execute: true },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
  },
  {
    octal: '777',
    label: '777 - Full Public Access',
    description: 'Read/write/execute for everyone (Insecure)',
    user: { read: true, write: true, execute: true },
    group: { read: true, write: true, execute: true },
    others: { read: true, write: true, execute: true },
  },
];

export default function ChmodCalculatorTool() {
  const [permissions, setPermissions] = useState<RolePermissions>({
    user: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
  });

  const [special, setSpecial] = useState<SpecialBits>({
    setuid: false,
    setgid: false,
    sticky: false,
  });

  const [isRecursive, setIsRecursive] = useState<boolean>(false);
  const [targetName, setTargetName] = useState<string>('filename');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calculateDigit = (p: PermissionState): number => {
    return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  };

  const calculateSpecialDigit = (): number => {
    return (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0);
  };

  const userOctal = calculateDigit(permissions.user);
  const groupOctal = calculateDigit(permissions.group);
  const othersOctal = calculateDigit(permissions.others);
  const specialOctal = calculateSpecialDigit();

  const octal3 = `${userOctal}${groupOctal}${othersOctal}`;
  const octal4 = `${specialOctal}${octal3}`;

  // Build symbolic format e.g. -rwxr-xr-x
  const getSymbolicRole = (p: PermissionState, specBit: boolean, specChar: string) => {
    const r = p.read ? 'r' : '-';
    const w = p.write ? 'w' : '-';
    let x = p.execute ? 'x' : '-';

    if (specBit) {
      x = p.execute ? specChar.toLowerCase() : specChar.toUpperCase();
    }

    return `${r}${w}${x}`;
  };

  const symbolicString = `-${getSymbolicRole(permissions.user, special.setuid, 's')}${getSymbolicRole(
    permissions.group,
    special.setgid,
    's'
  )}${getSymbolicRole(permissions.others, special.sticky, 't')}`;

  // Symbolic shorthand command format (e.g. u=rwx,g=rx,o=rx)
  const getSymbolicCommandRole = (p: PermissionState) => {
    let str = '';
    if (p.read) str += 'r';
    if (p.write) str += 'w';
    if (p.execute) str += 'x';
    return str;
  };

  const symbolicCmd = `u=${getSymbolicCommandRole(permissions.user)},g=${getSymbolicCommandRole(
    permissions.group
  )},o=${getSymbolicCommandRole(permissions.others)}`;

  const commandNumeric = `chmod ${isRecursive ? '-R ' : ''}${octal3} ${targetName || 'filename'}`;
  const commandSymbolic = `chmod ${isRecursive ? '-R ' : ''}${symbolicCmd} ${targetName || 'filename'}`;

  const togglePermission = (role: keyof RolePermissions, type: keyof PermissionState) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [type]: !prev[role][type],
      },
    }));
  };

  const toggleSpecial = (type: keyof SpecialBits) => {
    setSpecial((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const applyPreset = (preset: Preset) => {
    setPermissions({
      user: { ...preset.user },
      group: { ...preset.group },
      others: { ...preset.others },
    });
    setSpecial({ setuid: false, setgid: false, sticky: false });
  };

  const handleOctalInput = (val: string) => {
    const cleaned = val.replace(/[^0-7]/g, '').slice(0, 4);
    let digits = cleaned.split('').map(Number);

    if (digits.length === 3) {
      setSpecial({ setuid: false, setgid: false, sticky: false });
      const [u, g, o] = digits;
      setPermissions({
        user: { read: Boolean(u & 4), write: Boolean(u & 2), execute: Boolean(u & 1) },
        group: { read: Boolean(g & 4), write: Boolean(g & 2), execute: Boolean(g & 1) },
        others: { read: Boolean(o & 4), write: Boolean(o & 2), execute: Boolean(o & 1) },
      });
    } else if (digits.length === 4) {
      const [s, u, g, o] = digits;
      setSpecial({
        setuid: Boolean(s & 4),
        setgid: Boolean(s & 2),
        sticky: Boolean(s & 1),
      });
      setPermissions({
        user: { read: Boolean(u & 4), write: Boolean(u & 2), execute: Boolean(u & 1) },
        group: { read: Boolean(g & 4), write: Boolean(g & 2), execute: Boolean(g & 1) },
        others: { read: Boolean(o & 4), write: Boolean(o & 2), execute: Boolean(o & 1) },
      });
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resetAll = () => {
    setPermissions({
      user: { read: true, write: true, execute: true },
      group: { read: true, write: false, execute: true },
      others: { read: true, write: false, execute: true },
    });
    setSpecial({ setuid: false, setgid: false, sticky: false });
    setIsRecursive(false);
    setTargetName('filename');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Linux File Permissions (Chmod) Calculator</span>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Output Hero Display */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Octal Notation Display */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Octal Notation
              </span>
              <button
                onClick={() => handleCopy(specialOctal > 0 ? octal4 : octal3, 'octal')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedKey === 'octal' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-cyan-400">
                {specialOctal > 0 ? octal4 : octal3}
              </span>
              {specialOctal > 0 && (
                <span className="text-xs font-mono text-slate-500">(4-digit special)</span>
              )}
            </div>
          </div>

          {/* Symbolic Notation Display */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Symbolic Notation
              </span>
              <button
                onClick={() => handleCopy(symbolicString, 'symbolic')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedKey === 'symbolic' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Copy
              </button>
            </div>
            <p className="text-2xl font-bold font-mono text-slate-200">{symbolicString}</p>
          </div>

          {/* Manual Octal Input Override */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">
              Set via Octal Code
            </span>
            <input
              type="text"
              maxLength={4}
              placeholder="e.g. 755"
              onChange={(e) => handleOctalInput(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg text-cyan-300 font-mono text-lg focus:outline-none transition"
            />
          </div>
        </div>

        {/* Danger Alert for 777 */}
        {octal3 === '777' && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs font-mono text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Warning: Permission 777 grants full read, write, and execute access to everyone.
              Avoid using 777 in production environments.
            </span>
          </div>
        )}
      </div>

      {/* Interactive Permission Grid Matrix */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" /> Permission Matrix
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User (Owner) */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase">
                Owner (User)
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{userOctal}</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Read (4)</span>
                <input
                  type="checkbox"
                  checked={permissions.user.read}
                  onChange={() => togglePermission('user', 'read')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Write (2)</span>
                <input
                  type="checkbox"
                  checked={permissions.user.write}
                  onChange={() => togglePermission('user', 'write')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Execute (1)</span>
                <input
                  type="checkbox"
                  checked={permissions.user.execute}
                  onChange={() => togglePermission('user', 'execute')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Group */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase">Group</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{groupOctal}</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Read (4)</span>
                <input
                  type="checkbox"
                  checked={permissions.group.read}
                  onChange={() => togglePermission('group', 'read')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Write (2)</span>
                <input
                  type="checkbox"
                  checked={permissions.group.write}
                  onChange={() => togglePermission('group', 'write')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Execute (1)</span>
                <input
                  type="checkbox"
                  checked={permissions.group.execute}
                  onChange={() => togglePermission('group', 'execute')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Others */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase">Public (Others)</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{othersOctal}</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Read (4)</span>
                <input
                  type="checkbox"
                  checked={permissions.others.read}
                  onChange={() => togglePermission('others', 'read')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Write (2)</span>
                <input
                  type="checkbox"
                  checked={permissions.others.write}
                  onChange={() => togglePermission('others', 'write')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 cursor-pointer transition">
                <span className="text-xs text-slate-300">Execute (1)</span>
                <input
                  type="checkbox"
                  checked={permissions.others.execute}
                  onChange={() => togglePermission('others', 'execute')}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Special Flags (SetUID, SetGID, Sticky Bit) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">
            Special Permission Bits (Advanced)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition">
              <span className="text-xs text-slate-300 font-mono">SetUID (4)</span>
              <input
                type="checkbox"
                checked={special.setuid}
                onChange={() => toggleSpecial('setuid')}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition">
              <span className="text-xs text-slate-300 font-mono">SetGID (2)</span>
              <input
                type="checkbox"
                checked={special.setgid}
                onChange={() => toggleSpecial('setgid')}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition">
              <span className="text-xs text-slate-300 font-mono">Sticky Bit (1)</span>
              <input
                type="checkbox"
                checked={special.sticky}
                onChange={() => toggleSpecial('sticky')}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Terminal Command Generator */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Terminal Shell Commands
        </span>

        {/* Options for command */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-slate-500">Target File/Directory:</span>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="filename or path"
              className="flex-1 px-3 py-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded text-slate-200 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isRecursive}
              onChange={(e) => setIsRecursive(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
            <span>Recursive (-R)</span>
          </label>
        </div>

        {/* Command Output 1: Numeric */}
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs">
          <span className="text-cyan-300">{commandNumeric}</span>
          <button
            onClick={() => handleCopy(commandNumeric, 'cmd-num')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs transition ml-2 shrink-0"
          >
            {copiedKey === 'cmd-num' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy Command
          </button>
        </div>

        {/* Command Output 2: Symbolic */}
        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs">
          <span className="text-slate-400">{commandSymbolic}</span>
          <button
            onClick={() => handleCopy(commandSymbolic, 'cmd-sym')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs transition ml-2 shrink-0"
          >
            {copiedKey === 'cmd-sym' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy Command
          </button>
        </div>
      </div>

      {/* Common Presets */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> Common Permission Presets
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.octal}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 ${
                octal3 === preset.octal && specialOctal === 0
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{preset.label}</span>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {preset.octal}
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

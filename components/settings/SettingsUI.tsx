import React from "react";

export type SettingRowProps = {
  label: string;
  description?: string;
  children: React.ReactNode;
};

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[rgba(242,217,208,0.4)] py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <div className="text-sm font-semibold text-[rgba(59,47,50,0.98)]">{label}</div>
        {description && <p className="text-xs text-[rgba(126,107,111,0.95)] max-w-xs">{description}</p>}
      </div>
      <div className="flex items-center gap-2 text-xs text-[rgba(126,107,111,0.95)]">{children}</div>
    </div>
  );
}

export type SoftToggleProps = {
  on: boolean;
  onChange: (value: boolean) => void;
};

export function SoftToggle({ on, onChange }: SoftToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="relative inline-flex h-6 w-11 items-center rounded-full border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.9)] px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,184,201,0.8)]"
    >
      <span
        className={`h-4 w-4 rounded-full shadow-[0_2px_6px_rgba(123,104,108,0.2)] transition-transform ${
          on ? "translate-x-5 bg-gradient-to-br from-[#ffb8c9] to-[#ffe6a7]" : "translate-x-0 bg-[rgba(157,135,139,0.2)]"
        }`}
      />
    </button>
  );
}

export type SoftInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function SoftInput(props: SoftInputProps) {
  return (
    <input
      {...props}
      className={`rounded-xl border border-[rgba(242,217,208,0.9)] bg-[rgba(255,249,237,0.96)] px-3 py-1.5 text-sm text-[rgba(59,47,50,0.98)] focus:border-[var(--accent-pink)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-pink)] ${props.className}`}
    />
  );
}

export type ThemeOption = 'pink' | 'blue' | 'green' | 'purple';

export function ThemeSelector({ value, onChange }: { value: ThemeOption; onChange: (v: ThemeOption) => void }) {
  const themes: { id: ThemeOption; color: string }[] = [
    { id: 'pink', color: '#ffb8c9' },
    { id: 'blue', color: '#a8c6ff' },
    { id: 'green', color: '#bcead5' },
    { id: 'purple', color: '#e0c3fc' },
  ];

  return (
    <div className="flex gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`h-6 w-6 rounded-full border-2 transition-all ${
            value === t.id ? "border-[rgba(59,47,50,0.8)] scale-110" : "border-transparent hover:scale-105"
          }`}
          style={{ backgroundColor: t.color }}
          title={t.id}
        />
      ))}
    </div>
  );
}


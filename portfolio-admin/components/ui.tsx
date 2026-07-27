"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white focus:border-accentBlue focus:outline-none ${props.className ?? ""}`}
    />
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variants: Record<string, string> = {
    primary: "bg-accent text-white hover:opacity-90",
    secondary: "bg-panel2 text-white/90 border border-border hover:border-white/30",
    danger: "bg-danger/90 text-white hover:bg-danger",
    ghost: "text-muted hover:text-white",
  };
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

export function Field({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">
        {label} {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {help ? <span className="mt-1 block text-xs text-muted/70">{help}</span> : null}
    </label>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-panel/60 p-6 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "create" | "update" | "delete" }) {
  const tones: Record<string, string> = {
    default: "bg-panel2 text-white/70",
    create: "bg-emerald-500/15 text-emerald-400",
    update: "bg-amber-500/15 text-amber-400",
    delete: "bg-red-500/15 text-red-400",
  };
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

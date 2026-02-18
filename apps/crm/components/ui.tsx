import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) { return <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>; }
export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`rounded-md bg-blue-600 px-4 py-2 text-white ${className}`} {...props}>{children}</button>; }
export function Badge({ children }: { children: ReactNode }) { return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{children}</span>; }

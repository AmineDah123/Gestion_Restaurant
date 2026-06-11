type IconProps = { className?: string }

const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function IconDashboard({ className }: IconProps) {
  return <svg {...base} className={className}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
}

export function IconTables({ className }: IconProps) {
  return <svg {...base} className={className}><rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v12M19 8v12M9 8v12M15 8v12" /></svg>
}

export function IconCalendar({ className }: IconProps) {
  return <svg {...base} className={className}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
}

export function IconUsers({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}

export function IconMenu({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}

export function IconOrders({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>
}

export function IconKitchen({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M6 13v8M18 13v8" /><path d="M4 13h16a1 1 0 0 0 1-1V8a4 4 0 0 0-8 0v4M12 8V3M8 5l4-2 4 2" /></svg>
}

export function IconStock({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></svg>
}

export function IconUserCog({ className }: IconProps) {
  return <svg {...base} className={className}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h.5" /><circle cx="19" cy="17" r="2" /><path d="M19 11v1M19 23v-1M23 17h-1M15 17h-1M21.7 14.3l-.7.7M17 19.7l-.7.7M21.7 19.7l-.7-.7M17 14.3l-.7-.7" /></svg>
}

export function IconLogout({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
}

export function IconClose({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
}

export function IconMenuToggle({ className }: IconProps) {
  return <svg {...base} className={className}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
}

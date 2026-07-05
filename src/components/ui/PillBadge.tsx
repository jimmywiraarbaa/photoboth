import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PillBadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  active?: boolean
  icon?: ReactNode
}

export function PillBadge({
  children,
  active = false,
  icon,
  className,
  ...props
}: PillBadgeProps) {
  return (
    <button
      className={cn(
        'font-display inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold',
        'transition-all duration-200 active:scale-95',
        'border-2',
        active
          ? 'border-lilac-400 bg-gradient-to-r from-lilac-400 to-blush text-white shadow-[0_4px_14px_rgba(168,85,247,0.35)]'
          : 'border-lilac-200 bg-white/70 text-ink-soft hover:border-lilac-300 hover:text-lilac-600',
        className,
      )}
      {...props}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {children}
    </button>
  )
}

interface SegmentedToggleProps<T extends string> {
  options: { value: T; label: ReactNode; icon?: ReactNode }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedToggleProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex rounded-full border-2 border-lilac-200 bg-white/70 p-1',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'font-display flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold',
            'transition-all duration-200 active:scale-95',
            value === opt.value
              ? 'bg-gradient-to-r from-lilac-400 to-blush text-white shadow-[0_2px_10px_rgba(168,85,247,0.3)]'
              : 'text-ink-soft hover:text-lilac-600',
          )}
        >
          {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CuteCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: boolean
  variant?: 'glass' | 'glass-lilac' | 'solid'
}

export function CuteCard({
  children,
  glow = false,
  variant = 'glass',
  className,
  ...props
}: CuteCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border-2 border-white/60',
        'transition-all duration-300',
        variant === 'glass' && 'glass',
        variant === 'glass-lilac' && 'glass-lilac',
        variant === 'solid' && 'bg-white shadow-cute',
        glow && 'shadow-glow',
        !glow && 'shadow-cute-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'mint'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface CuteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-lilac-400 to-blush text-white shadow-[0_4px_16px_rgba(168,85,247,0.35)] hover:shadow-[0_6px_24px_rgba(168,85,247,0.45)] hover:brightness-110',
  secondary:
    'bg-white/80 text-lilac-700 border-2 border-lilac-200 shadow-cute hover:bg-white hover:border-lilac-300',
  ghost:
    'bg-transparent text-lilac-600 hover:bg-lilac-100/60',
  danger:
    'bg-gradient-to-r from-rose-400 to-blush text-white shadow-[0_4px_16px_rgba(244,114,182,0.3)] hover:brightness-110',
  mint:
    'bg-gradient-to-r from-mint to-sky text-ink shadow-[0_4px_16px_rgba(134,239,172,0.3)] hover:brightness-105',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
  xl: 'px-10 py-5 text-lg gap-3',
}

export const CuteButton = forwardRef<HTMLButtonElement, CuteButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      fullWidth,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-display inline-flex items-center justify-center rounded-full font-semibold',
          'transition-all duration-200 active:scale-95',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-lilac-200',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    )
  },
)

CuteButton.displayName = 'CuteButton'

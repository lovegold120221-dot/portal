import { cn } from '@/lib/utils'

type LogoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      src='/images/eburon-logo.png'
      alt='Eburon AI'
      className={cn('size-8 rounded-lg object-contain', className)}
      {...props}
    />
  )
}

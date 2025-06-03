import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const containerVariants = cva(
  'w-full py-3 px-5 mx-auto',
  {
    variants: {
      variant: {
        default: 'flex justify-between items-center',
        row: 'flex flex-row justify-between items-center',
        column: 'flex flex-col justify-between items-center gap-y-4',
        grid: 'grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3'
      },
      size: {
        default: 'max-w-5xl',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof containerVariants> {}

function Container({ className, variant, size, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ variant, size }), className)} {...props} />
  )
}

Container.displayName = 'Container'

export { Container, containerVariants }

// export default function Container({
//   children,
// }: Readonly<{
//   children?: React.ReactNode;
// }>) {
//   return (
//     <div className="w-full max-w-5xl flex gap-20 justify-between items-center p-3 px-4">
//       <div className="p-4">
//         {children}
//       </div>
//     </div>
//   )
// }
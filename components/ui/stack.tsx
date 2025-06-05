import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const stackVariants = cva(
  'w-full flex py-3 px-5 gap-4 mx-auto flex-wrap',
  {
    variants: {
      direction: {
        row: 'flex-row',
        column: 'flex-col',
      },
      variant: {
        between: 'justify-between items-center',
        center: 'justify-center items-center',
      },
    },
    defaultVariants: {
      direction: 'column',
      variant: 'between',
    },
  },
)

export interface StackProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof stackVariants> {}

function Stack({ className, direction, variant, ...props }: StackProps) {
  return (
    <div className={cn(stackVariants({ direction, variant }), className)} {...props} />
  )
}

Stack.displayName = 'Stack'

export { Stack, stackVariants }

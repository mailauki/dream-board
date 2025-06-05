/* eslint-disable no-console */

'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

const avatarVariants = cva(
  'inline-block rounded-full ring-4 ring-white dark:ring-black bg-muted-foreground overflow-hidden border-muted-foreground flex items-center justify-center',
  {
    variants: {
      size: {
        default: 'border-[6px] size-12',
        sm: 'border-4 size-9',
        lg: 'border-8 size-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
const iconVariants = cva(
  'rounded-full text-background',
  {
    variants: {
      size: {
        default: 'size-12',
        sm: 'size-9',
        lg: 'size-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export interface AvatarProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof avatarVariants> {}

function Avatar({
  url, className, size, ...props
}: AvatarProps & {
	url?: string
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)

        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)

        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }
    if (url) downloadImage(url)
  }, [url, supabase])

  return (
    <>
      {avatarUrl ? (
        <div >
          <Image
            alt="Avatar"
            className={cn(iconVariants({ size }), className, 'inline-block rounded-full ring-4 ring-white dark:ring-black bg-muted-foreground overflow-hidden border-muted-foreground flex items-center justify-center')}
            {...props}
            height={40}
            src={avatarUrl}
            width={40}
          />
        </div>
      ) : (
        <div className={cn(avatarVariants({ size }), className)} {...props}>
          <UserIcon className={cn(iconVariants({ size }), className)} fill='currentColor' />
        </div>
      )}
    </>
  )
}

export { Avatar, avatarVariants }

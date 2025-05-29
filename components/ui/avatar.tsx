/* eslint-disable no-console */

'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

const avatarVariants = cva(
  'bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden border-gray-300 dark:border-gray-700 flex items-center justify-center',
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
  'rounded-full text-gray-100 dark:text-gray-800',
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
        <Image
          alt="Avatar"
          className={cn(iconVariants({ size }), className)}
          {...props}
          height={40}
          src={avatarUrl}
          width={40}
        />
      ) : (
        <div className={cn(avatarVariants({ size }), className)} {...props}>
          <UserIcon className={cn(iconVariants({ size }), className)} fill='currentColor' />
        </div>
      )}
    </>
  )
}

export { Avatar, avatarVariants }

// import Image from 'next/image'
// import { UserIcon } from 'lucide-react'

// const avatarVariants = cva(
//   {
//     variants: {
//       size: {
//         default: 'h-10 px-4 py-2',
//         lg: 'h-11 rounded-md px-8',
//       },
//     },
//     defaultVariants: {
//       size: 'default',
//     },
//   },
// )


// export default function Avatar({
//   url,
//   size,
// }: {
// 	url?: string | null,
// 	size?: 'default' | 'lg',
// }) {
//   const supabase = createClient()
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

//   useEffect(() => {
//     async function downloadImage(path: string) {
//       try {
//         const { data, error } = await supabase.storage.from('avatars').download(path)

//         if (error) {
//           throw error
//         }
//         const url = URL.createObjectURL(data)

//         setAvatarUrl(url)
//       } catch (error) {
//         console.log('Error downloading image: ', error)
//       }
//     }
//     if (url) downloadImage(url)
//   }, [url, supabase])

//   return (
//     <>
//       {avatarUrl ? (
//         <Image
//           alt="Avatar"
//           className={`rounded-full m-1 size-${size}`}
//           height={40}
//           src={avatarUrl}
//           width={40}
//         />
//       ) : (
//         <div className={`bg-gray-300 text-gray-100 size-${size || 12} rounded-full overflow-hidden border-${size ? '8' : '[6px]'} border-gray-300 flex items-center justify-center`}>
//           <UserIcon className={`size-${size || 12}`} fill='currentColor' />
//         </div>
//       )}
//     </>
//   )
// }
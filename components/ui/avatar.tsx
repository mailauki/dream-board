/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { UserIcon } from 'lucide-react'

import { createClient } from '@/utils/supabase/client'

export default function Avatar({ url, size }: { url?: string | null, size?: number }) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
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
          className={`rounded-full m-1 size-${size}`}
          height={40}
          src={avatarUrl}
          width={40}
        />
      ) : (
        <div className={`bg-gray-300 text-gray-100 size-${size || 12} rounded-full overflow-hidden border-${size ? '8' : '[6px]'} border-gray-300 flex items-center justify-center`}>
          <UserIcon className={`size-${size || 12}`} fill='currentColor' />
        </div>
      )}
    </>
  )
}
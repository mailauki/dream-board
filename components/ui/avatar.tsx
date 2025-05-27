/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { UserIcon } from 'lucide-react'

import { createClient } from '@/utils/supabase/client'

export default function Avatar({ url }: { url?: string | null }) {
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
          className='rounded-full'
          height={40}
          src={avatarUrl}
          width={40}
        />
      ) : (
        <div className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700">
          <UserIcon />
        </div>
      )}
    </>
  )
}
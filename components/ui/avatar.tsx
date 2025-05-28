/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
          className='rounded-full m-1'
          height={40}
          src={avatarUrl}
          width={40}
        />
      ) : (
        <svg aria-hidden="true" className="size-12 text-gray-300" data-slot="icon" fill="currentColor" viewBox="0 0 24 24">
          <path clipRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" fillRule="evenodd" />
        </svg>
      )}
      {/* {avatarUrl ? (
        <Image
          alt="Avatar"
          className='rounded-full'
          height={40}
          src={avatarUrl}
          width={40}
        />
      ) : (
        // <div className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700">
        //   <UserIcon />
        // </div>
        <div>
          <svg aria-hidden="true" className="size-12 text-gray-300" data-slot="icon" fill="currentColor" viewBox="0 0 24 24">
            <path clipRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" fillRule="evenodd" />
          </svg>
        </div>
      )} */}
    </>
  )
}
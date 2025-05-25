/* eslint-disable no-console */
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { createClient } from '@/utils/supabase/client'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export default function UploadAvatar({ url, uid }: { url: string, uid: string }) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

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

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}/${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      // onUpload(filePath)

      const { error } = await supabase.auth.updateUser({ data: { avatar_url: filePath } })

      if (error) {
        throw error // Throw the Supabase error to be caught
      }
    } catch (error) {
      console.log(error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div>
        {avatarUrl ? (
          <Image
            alt="Avatar"
            className='rounded'
            height={160}
            src={avatarUrl}
            width={160}
          />
        ) : (
          <div className="bg-gray-300 rounded w-40 h-40" />
        )}
        <div className='w-40'>
          <Button asChild className='w-full mt-2 mb-3'>
            <Label htmlFor="avatar_file">
              {uploading ? 'Uploading ...' : 'Upload'}
            </Label>
          </Button>
          <Input
            accept="image/*"
            disabled={uploading}
            id="avatar_file"
            name="avatar_file"
            style={{
              visibility: 'hidden',
              position: 'absolute',
            }}
            type="file"
            onChange={uploadAvatar}
          />
        </div>
      </div>
    </>
  )
}
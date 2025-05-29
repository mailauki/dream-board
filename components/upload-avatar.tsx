/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/utils/supabase/client'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'

export default function UploadAvatar({ url, uid }: { url?: string | null, uid: string }) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function getAvatar() {
      try {
        const { data: avatar, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', uid)
          .single()

        if (error) {
          throw error
        }

        setAvatarUrl(avatar.avatar_url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }
    getAvatar()
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

      const { error: userError } = await supabase.auth.updateUser({ data: { avatar_url: filePath } })

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath, updated_at: new Date().toISOString() })
        .eq('user_id', uid)

      if (userError || profileError) {
        throw userError || profileError
      }
    } catch (error) {
      console.log(error)
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-2 flex items-center gap-x-3">
      <Avatar url={avatarUrl || ''} />
      <div>
        <Button asChild variant={'outline'}>
          <Label htmlFor="avatar_file">
            {uploading ? 'Changing...' : 'Change'}
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
  )
}
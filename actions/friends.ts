'use server'

import { createClient } from '@/utils/supabase/server'

export const acceptFriendRequest = async (formData: FormData) => {
  const supabase = await createClient()
  const friend_id = formData.get('friend_id')?.toString()

  const { error } = await supabase
    .from('friends')
    .update({'accepted': true})
    .eq('id', Number(friend_id!))

  if (error) {
    throw error
  }
}

export const denyFriendRequest = async (formData: FormData) => {
  const supabase = await createClient()
  const friend_id = formData.get('friend_id')?.toString()

  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', Number(friend_id!))

  if (error) {
    throw error
  }
}
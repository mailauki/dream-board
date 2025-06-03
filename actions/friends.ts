/* eslint-disable no-console */
'use server'

import { createClient } from '@/utils/supabase/server'

export const sendFriendRequest = async (formData: FormData) => {
  const supabase = await createClient()
  const profile_id = formData.get('profile-id')?.toString()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', Number(profile_id))
    .single()

  console.log({
    receiver_id: profile?.user_id,
    sender_id: user?.id,
  })

  const { error } = await supabase
    .from('friends')
    .insert([{
      receiver_id: profile?.user_id,
      sender_id: user?.id,
    }])

  if (error) {
    throw error
  }
}

export const acceptFriendRequest = async (formData: FormData) => {
  const supabase = await createClient()
  const friend_id = formData.get('friend-id')?.toString()

  console.log(friend_id)

  const { data, error } = await supabase
    .from('friends')
    .update({ 'accepted': true })
    .eq('id', Number(friend_id!))

  console.log(data)

  if (error) {
    // throw error
    console.log(error.message)
  }
}

export const denyFriendRequest = async (formData: FormData) => {
  const supabase = await createClient()
  const friend_id = formData.get('friend-id')?.toString()

  console.log(friend_id)

  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', Number(friend_id!))

  if (error) {
    throw error
  }
}
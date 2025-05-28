/* eslint-disable no-console */
'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const updateUser = async (formData: FormData) => {
  const supabase = await createClient()
  const id = Number(formData.get('profile-id')?.toString())
  const rawFormData = {
    first_name: formData.get('first-name')?.toString() || null,
    last_name: formData.get('last-name')?.toString() || null,
    username: formData.get('username')?.toString() || null,
    about: formData.get('about')?.toString() || null,
    updated_at: new Date().toISOString(),
  }
  const display_name = rawFormData.first_name ? `${rawFormData.first_name} ${rawFormData.last_name || ''}` : null

  console.log(rawFormData)

  const { error: userError } = await supabase.auth.updateUser({ data: { display_name } })
  const { error: profileError } = await supabase
    .from('profiles')
    .update(rawFormData)
    .eq('id', id)

  if (userError || profileError) {
    throw userError || profileError
  }

  redirect('/protected')
}

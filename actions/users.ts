
'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const updateUser = async (formData: FormData) => {
  const supabase = await createClient()
  const display_name = formData.get('display_name')?.toString()

  const { error } = await supabase.auth.updateUser({ data: { display_name } })

  if (error) {
    throw error // Throw the Supabase error to be caught
  }

  redirect('/protected')
}

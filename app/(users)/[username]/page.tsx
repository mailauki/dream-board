import { createClient } from '@/utils/supabase/server'
import Profile from '@/components/user-profile'

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  return (
    <Profile profile={profile} />
  )
}
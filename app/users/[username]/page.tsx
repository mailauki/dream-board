// import Avatar from '@/components/ui/avatar'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

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
  const { count: dreamsCount } = await supabase
    .from('dreams')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.user_id || '')
  const { count: friendsCount } = await supabase
    .from('friends')
    .select('*', { count: 'exact', head: true })
    .eq('accepted', true)
    .or(`sent.eq.${profile?.user_id},received.eq.${profile?.user_id}`)

  return (
    <div className='flex flex-col gap-y-4'>
      <div className=' flex flex-col items-center'>
        <Avatar size={'lg'} url={profile?.avatar_url || ''} />
        <h1 className='text-2xl mt-3'>{profile?.first_name} {profile?.last_name}</h1>
        <div className='flex gap-x-3 text-gray-600'>
          <p>@{username}</p>
          <span>•</span>
          <p>Joined {new Date(profile?.created_at || '').toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
        </div>
        <div className='flex gap-x-4 items-center my-4'>
          <div>Dreams: <span>{dreamsCount}</span></div>
          <div>Friends: <span>{friendsCount || 0}</span></div>
          <Button>Add friend</Button>
        </div>
      </div>
      <div>
        <h2 className='text-lg text-bold'>About</h2>
        <p>{profile?.about}</p>
      </div>
    </div>
  )
}
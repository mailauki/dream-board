import { sendFriendRequest } from '@/actions/friends'
import { Container } from '@/components/layout/container'
import { SubmitButton } from '@/components/submit-button'
import { Avatar } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    .or(`sender_id.eq.${profile?.user_id},receiver_id.eq.${profile?.user_id}`)

  const { data: { user } } = await supabase.auth.getUser()
  const { data: friend } = await supabase
    .from('friends')
    .select('id, accepted, created_at, from:profiles!friends_sender_id_fkey(*), to:profiles!friends_receiver_id_fkey(*)')
    .or(`sender_id.eq.${profile?.user_id},and(receiver_id.eq.${user?.id}),receiver_id.eq.${profile?.user_id},and(sender_id.eq.${user?.id})`)
    .single()
  const isFriend = friend && friend.accepted ? true : false
  const isRequestSent = friend && !friend.accepted ? true : false
  //  if !isFriend -> add friend
  //  if isFriend & !accepted -> request sent
  //  if isFriend & accepted -> friends

  return (
    <Container className='pt-0' variant={'column'}>
      <div className='relative w-full h-66'>
        <div className='absolute w-full h-40 z-0 bg-accent' />
        <div className='relative mt-28 h-40 z-10 w-full flex flex-col items-center'>
          <Avatar size={'lg'} url={profile?.avatar_url || ''} />
          <h1 className='text-2xl mt-3'>{profile?.first_name} {profile?.last_name}</h1>
          <div className='flex gap-x-3 text-gray-600'>
            <p>@{username}</p>
            <span>•</span>
            <p>Joined {new Date(profile?.created_at || '').toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
      <Container className='px-0' variant={'grid'}>
        <div className='lg:col-span-2 py-3 px-5'>
          <h2 className='text-lg text-bold'>About</h2>
          <p>{profile?.about}</p>
        </div>
        <div className='py-3 px-5'>
          <div className='flex gap-x-4 items-center my-4'>
            <form>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
                <Label htmlFor="profile-id">Profile ID</Label>
                <Input
                  readOnly
                  defaultValue={profile?.id}
                  id='profile-id'
                  name='profile-id'
                  type='number'
                />
              </div>
              <SubmitButton
                disabled={isFriend || isRequestSent}
                formAction={sendFriendRequest}
                pendingText='Loading...'
              >
                {isFriend ? 'Friends' : isRequestSent ? 'Request sent' : 'Add friend'}
              </SubmitButton>
            </form>
          </div>
          <div>Dreams: <span>{dreamsCount}</span></div>
          <div>Friends: <span>{friendsCount || 0}</span></div>
        </div>
      </Container>
    </Container>
  )
}
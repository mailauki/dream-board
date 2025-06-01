import { GiftIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

import { Tables } from '@/types/supabase'
import { signOutAction } from '@/actions/auth'
import { sendFriendRequest } from '@/actions/friends'
import { createClient } from '@/utils/supabase/server'

import { Button } from './ui/button'
import { Container } from './layout/container'
import { SubmitButton } from './submit-button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Avatar } from './ui/avatar'


export default async function Profile({
  profile,
}: {
	profile: Tables<'profiles'> | null;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { count: dreamsCount } = await supabase
    .from('dreams')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.user_id || '')
  const { count: friendsCount } = await supabase
    .from('friends')
    .select('*', { count: 'exact', head: true })
    .eq('accepted', true)
    .or(`sender_id.eq.${profile?.user_id},receiver_id.eq.${profile?.user_id}`)

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
            <p>@{profile?.username}</p>
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
        <div className='border rounded-lg py-3 px-5 flex flex-col gap-y-3'>
          <div className='flex justify-between items-center gap-x-2'>
            <form className={profile?.user_id === user?.id ? 'hidden' : ''}>
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
            <form
              action={signOutAction}
              className={profile?.user_id === user?.id ?  'flex flex-1 justify-end' : 'hidden'}
            >
              <Button type="submit" variant={'outline'}>
									Sign out
              </Button>
            </form>
          </div>

          <Button asChild className='justify-between' variant={'secondary'}>
            <Link href={`/${profile?.username}/dreams`}>
              <div className='flex items-center gap-x-3'>
                <span><GiftIcon size='20' /></span>
                <span className='text-lg font-medium'>{dreamsCount || 0}</span>
              </div>
              <span className='text-xs'>dreams</span>
            </Link>
          </Button>
          <Button asChild className='justify-between' variant={'secondary'}>
            <Link href='/friends'>
              <div className='flex items-center gap-x-3'>
                <span><UsersIcon size='20' /></span>
                <span className='text-lg font-medium'>{friendsCount || 0}</span>
              </div>
              <span className='text-xs'>friends</span>
            </Link>
          </Button>
        </div>
      </Container>
    </Container>
  )
}
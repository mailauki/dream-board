import { GiftIcon, PencilIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

import { Tables } from '@/types/supabase'
import { signOutAction } from '@/actions/auth'
import { createClient } from '@/utils/supabase/server'

import { Button } from './ui/button'
import { Container } from './layout/container'
import { Avatar } from './ui/avatar'
import LinkPreview from './link-preview'
import UserChip from './ui/user-chip'
import FriendButton from './friend-button'
import FriendRequest from './friend-request'


export default async function Profile({
  profile,
}: {
	profile: Tables<'profiles'> | null;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: dreams } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', profile?.user_id || '')
  const { count: dreamsCount } = await supabase
    .from('dreams')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile?.user_id || '')
  const { data: friends } = await supabase
    .from('friends')
    .select('id, accepted, created_at, from:profiles!friends_sender_id_fkey(*), to:profiles!friends_receiver_id_fkey(*)')
    .eq('accepted', true)
    .or(`sender_id.eq.${profile?.user_id},receiver_id.eq.${profile?.user_id}`)
  const { count: friendsCount } = await supabase
    .from('friends')
    .select('*', { count: 'exact', head: true })
    .eq('accepted', true)
    .or(`sender_id.eq.${profile?.user_id},receiver_id.eq.${profile?.user_id}`)

  const { data: pendingFriends } = await supabase
    .from('friends')
    .select('id, accepted, created_at, from:profiles!friends_sender_id_fkey(*), to:profiles!friends_receiver_id_fkey(*)')
    .eq('accepted', false)
    .or(`sender_id.eq.${profile?.user_id},and(receiver_id.eq.${user?.id}),receiver_id.eq.${profile?.user_id},and(sender_id.eq.${user?.id})`)
    .not('sender_id', 'eq', profile?.user_id)
  const { count: pendingFriendsCount } = await supabase
    .from('friends')
    .select('*', { count: 'exact', head: true })
    .eq('accepted', false)
    .or(`sender_id.eq.${profile?.user_id},and(receiver_id.eq.${user?.id}),receiver_id.eq.${profile?.user_id},and(sender_id.eq.${user?.id})`)

  const { data: friend } = await supabase
    .from('friends')
    .select('*')
    .or(`sender_id.eq.${profile?.user_id},and(receiver_id.eq.${user?.id}),receiver_id.eq.${profile?.user_id},and(sender_id.eq.${user?.id})`)
    .single()

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
        <div className='flex flex-col md:flex-row justify-end items-end md:items-center gap-2 absolute bottom-4 right-4 z-10'>
          {profile?.user_id === user?.id ? (
            <>
              <Button asChild>
                <Link href='/edit-profile'>
                  <PencilIcon size={'16'} />
									Edit profile
                </Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant={'outline'}>
									Sign out
                </Button>
              </form>
            </>
          ) : (
            <FriendButton friend={friend} profile_id={profile?.id} />
          )}
        </div>
      </div>
      <Container className='px-0' variant={'grid'}>
        <div className='lg:col-span-2 py-3 px-5'>
          <h2 className='text-lg font-semibold'>About</h2>
          <p>{profile?.about}</p>
        </div>
        <Container className='border rounded-lg mx-4 lg:mx-0' size={'sm'} variant={'column'}>
          <Button asChild className='w-full justify-between' variant={'secondary'}>
            <Link href={`/${profile?.username}/dreams`}>
              <div className='flex justify-between items-center gap-x-3'>
                <span><GiftIcon size='20' /></span>
                <span className='text-lg font-medium text-center min-w-8'>{dreamsCount || 0}</span>
              </div>
              <span className='text-xs'>dreams</span>
            </Link>
          </Button>
          <Button asChild className='w-full justify-between' variant={'secondary'}>
            <Link href='/friends'>
              <div className='flex justify-between items-center gap-x-3'>
                <span><UsersIcon size='20' /></span>
                <span className='text-lg font-medium text-center min-w-8'>{friendsCount || 0}</span>
              </div>
              <span className='text-xs'>friends</span>
            </Link>
          </Button>
        </Container>

        <div className='lg:col-span-2 py-3 px-5'>
          <h2 className='text-lg font-semibold'>Dreams</h2>
          <Container className='px-0 lg:grid-cols-2 gap-y-8' variant={'grid'}>
            {dreams && (dreamsCount! > 0) ? (
              dreams.map(dream => <LinkPreview key={dream.id} data={dream} />)
            ) : (
              <div className='col-span-full flex flex-1 justify-center py-8'>
                <p>No dreams yet</p>
              </div>
            )}
          </Container>
        </div>
        <Container className='mx-0 items-start justify-between' size={'sm'} variant={'column'}>
          <div className='w-full'>
            <h2 className='text-lg font-semibold'>Friends</h2>
            {profile?.user_id === user?.id && pendingFriends && (
              <>
                <div className='flex justify-between items-center text-xs uppercase'>
                  <div className='flex justify-between items-center gap-x-2'><h3 className='font-medium'>Requests</h3>
                    <span className='bg-accent text-center min-w-4 p-0.5 px-1.5 rounded font-semibold'>
                      {pendingFriendsCount || 0}
                    </span>
                  </div>
                  <Button asChild className='text-xs' size={'sm'} variant={'link'}>
                    <Link href='/friends'>See all</Link>
                  </Button>
                </div>
                {pendingFriends.length > 0 && (
                  <FriendRequest
                    friend_id={pendingFriends[0].id}
                    sender={pendingFriends[0].from}
                  />
                )}
              </>
            )}
          </div>
          <Container className='mx-0' size={'sm'} variant={'column'}>
            {(!friends || friends.length === 0) ? (
              <div className='flex flex-1 justify-center py-8'>
                <p>No friends yet</p>
              </div>
            ) : (
              friends.map((friend) => (
                friend.to?.user_id === profile?.user_id ? (
                  <UserChip key={friend.id} user={friend.from!} />
                ) : (
                  <UserChip key={friend.id} user={friend.to!} />
                )
              )))}
          </Container>
        </Container>
      </Container>
    </Container>
  )
}
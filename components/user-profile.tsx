import { GiftIcon, MoreVerticalIcon, PlusIcon, UsersIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { Tables } from '@/types/supabase'
import { signOutAction } from '@/actions/auth'
import { acceptFriendRequest, denyFriendRequest, sendFriendRequest } from '@/actions/friends'
import { createClient } from '@/utils/supabase/server'

import { Button } from './ui/button'
import { Container } from './layout/container'
import { SubmitButton } from './submit-button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Avatar } from './ui/avatar'
import LinkPreview from './link-preview'
import UserChip from './ui/user-chip'


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
          <h2 className='text-lg font-semibold'>About</h2>
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

        <div className='lg:col-span-2 py-3 px-5'>
          <h2 className='text-lg font-semibold'>Dreams</h2>
          <Container className='px-0 lg:grid-cols-2 gap-y-8' variant={'grid'}>
            {dreams && (dreamsCount! > 0) ? (
              dreams.map(dream => <LinkPreview key={dream.id} data={dream} />)
            ) : (
              <div className='col-span-full flex flex-1 justify-center py-8'>
                <p>No dreams yet.</p>
              </div>
            )}
          </Container>
        </div>
        <div className='py-3 px-5'>
          <h2 className='text-lg font-semibold'>Friends</h2>
          {(friends && (friendsCount! > 0)) ? (
            friends.map((friend) => (
              friend.to?.user_id === profile?.user_id ? (
                <UserChip
                  key={friend?.id}
                  action={friend.to?.user_id === user?.id ? (
                    <form className='flex gap-x-2'>
                      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
                        <Label htmlFor="friend-id">Friend ID</Label>
                        <Input
                          readOnly
                          defaultValue={friend.id}
                          id='friend-id'
                          name='friend-id'
                          type="number"
                        />
                      </div>
                      {!friend.accepted && (
                        <Button
                          className='size-12'
                          formAction={acceptFriendRequest}
                          size={'icon'}
                          variant={'accept'}
                        >
                          <PlusIcon />
                        </Button>
                      )}
                      <Button
                        className='size-12'
                        formAction={denyFriendRequest}
                        size={'icon'}
                        variant={'deny'}
                      >
                        <XIcon />
                      </Button>
                    </form>
                  ) : (
                    <Button asChild className='size-12' size={'icon'} variant={'secondary'}>
                      <Link href={`/${friend.from?.username}`}>
                        <MoreVerticalIcon />
                      </Link>
                    </Button>
                  )}
                  avatar={<Avatar url={friend.from?.avatar_url || ''} />}
                  subheader={friend.from?.username}
                  title={`${friend.from?.first_name} ${friend.from?.last_name || ''}`}
                />
              ) : (
                <UserChip
                  key={friend?.id}
                  action={
                    <Button asChild className='size-12' size={'icon'} variant={'secondary'}>
                      <Link href={`/${friend.to?.username}`}>
                        <MoreVerticalIcon />
                      </Link>
                    </Button>
                  }
                  avatar={<Avatar url={friend.to?.avatar_url || ''} />}
                  subheader={friend.to?.username}
                  title={`${friend.to?.first_name} ${friend.to?.last_name || ''}`}
                />
              )
            ))
          ) : (
            <div className='col-span-full flex flex-1 justify-center py-8'>
              <p>No friends yet.</p>
            </div>
          )}
        </div>
      </Container>
    </Container>
  )
}
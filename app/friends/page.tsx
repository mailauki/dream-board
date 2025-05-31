import { redirect } from 'next/navigation'
import { MoreVerticalIcon, PlusIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/utils/supabase/server'
import UserChip from '@/components/ui/user-chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { acceptFriendRequest, denyFriendRequest } from '@/actions/friends'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import SearchInput from '@/components/search-input'
import { Container } from '@/components/layout/container'

export default async function FriendsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const { data: friends } = await supabase
    .from('friends')
    .select('id, accepted, created_at, from:profiles!friends_sender_id_fkey(*), to:profiles!friends_receiver_id_fkey(*)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

  return (
    <>
      <SearchInput />
      <Container variant={'grid'}>
        {(!friends || friends.length === 0) ? (
          <p>No friends yet</p>
        ) : (
          friends.map((friend) => (
            friend.to?.user_id === user.id ? (
              <UserChip
                key={friend?.id}
                action={
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
                }
                avatar={<Avatar url={friend.from?.avatar_url || ''} />}
                subheader={friend.from?.username}
                title={`${friend.from?.first_name} ${friend.from?.last_name || ''}`}
              />
            ) : (
              <UserChip
                key={friend?.id}
                action={
                  <Button asChild className='size-12' size={'icon'} variant={'secondary'}>
                    <Link href={`/users/${friend.to?.username}`}>
                      <MoreVerticalIcon />
                    </Link>
                  </Button>
                }
                avatar={<Avatar url={friend.to?.avatar_url || ''} />}
                subheader={friend.to?.username}
                title={`${friend.to?.first_name} ${friend.to?.last_name || ''}`}
              />
            )
          )))}
      </Container>
      {/* <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your friends</h2>
          {(!friends || friends.length === 0) ? (
            <p>No friends yet</p>
          ) : (
            friends.map((friend) => (
              friend.to?.user_id === user.id ? (
                <UserChip
                  key={friend?.id}
                  action={
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
                  }
                  avatar={<Avatar url={friend.from?.avatar_url || ''} />}
                  subheader={friend.from?.username}
                  title={`${friend.from?.first_name} ${friend.from?.last_name || ''}`}
                />
              ) : (
                <UserChip
                  key={friend?.id}
                  action={
                    <Button asChild className='size-12' size={'icon'} variant={'secondary'}>
                      <Link href={`/users/${friend.to?.username}`}>
                        <MoreVerticalIcon />
                      </Link>
                    </Button>
                  }
                  avatar={<Avatar url={friend.to?.avatar_url || ''} />}
                  subheader={friend.to?.username}
                  title={`${friend.to?.first_name} ${friend.to?.last_name || ''}`}
                />
              )
            )))}
        </div>
      </div> */}
    </>
  )
}
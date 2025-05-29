import { redirect } from 'next/navigation'
import { PlusIcon, XIcon } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import UserChip from '@/components/ui/user-chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { acceptFriendRequest, denyFriendRequest } from '@/actions/friends'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import SearchInput from '@/components/search-input'

export default async function FriendsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const { data: friends } = await supabase
    .from('friends')
    .select('id, accepted, created_at, from:profiles!friends_sender_id_fkey(*), to:profiles!friends_receiver_id_fkey(*)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

  const friendList = friends?.map((friend) => {
    if (friend.from?.user_id !== user.id) return Object.assign({
      ...friend.from,
      id: friend.id,
      accepted: friend.accepted
    })
    else if (friend.to?.user_id !== user.id) return friend.to
    else return null
  })

  return (
    <>
      <SearchInput />
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your friends</h2>
          {/* <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(friends, null, 2)}
          </pre> */}
          {(!friendList || friendList.length === 0) ? (
            <p>No friends yet</p>
          ) : (
            friendList.map((friend) => (
              <UserChip
                key={friend?.id}
                action={!friend.accepted && (
                  <form className='flex gap-x-2'>
                    <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
                      <Label htmlFor="id">ID</Label>
                      <Input readOnly aria-label='item-id-input' defaultValue={friend.id} name='friend_id' type="number" />
                    </div>
                    <Button className='rounded-full'  formAction={acceptFriendRequest} size={'icon'} variant={'accept'}>
                      <PlusIcon />
                    </Button>
                    <Button className='rounded-full' formAction={denyFriendRequest} size={'icon'} variant={'deny'}>
                      <XIcon />
                    </Button>
                  </form>
                )}
                avatar={<Avatar url={friend?.avatar_url} />}
                subheader={friend?.username}
                title={`${friend?.first_name} ${friend?.last_name || ''}`}
              />
            )))}
        </div>
      </div>
    </>
  )
}
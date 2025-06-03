import { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { denyFriendRequest, sendFriendRequest } from '@/actions/friends'

import { Input } from './ui/input'
import { Button } from './ui/button'

export default async function FriendButton({
  friend,
  profile_id,
}: {
  friend: Tables<'friends'> | null;
  profile_id?: number | null;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const isFriend = friend && friend.accepted ? true : false
  const isRequestSent = friend && !friend.accepted ? true : false
  const fromMe = friend && friend.sender_id === user?.id ? true : false

  //  if !isFriend -> add friend
  //  if isFriend & !accepted -> request sent
  //  if isFriend & accepted -> already friends

  if (isRequestSent && fromMe) {
    return (
      <Button disabled>
        Request sent
      </Button>
    )
  }

  if (isRequestSent && !fromMe) {
    return (
      <Button disabled>
        Request pending
      </Button>
    )
  }

  if (isFriend) {
    return (
      <form>
        <Input
          readOnly
          aria-label='Friend ID'
          className='hidden'
          defaultValue={friend?.id}
          name='friend-id'
          type="number"
        />
        <Button formAction={denyFriendRequest}>
					Remove friend
        </Button>
      </form>
    )
  }

  return (
    <form>
      <Input
        readOnly
        aria-label='Profile ID'
        className='hidden'
        defaultValue={profile_id!}
        name='profile-id'
        type="number"
      />
      <Button formAction={sendFriendRequest}>
				Add friend
      </Button>
    </form>
  )
}
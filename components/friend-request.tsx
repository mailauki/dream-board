import Link from 'next/link'

import { acceptFriendRequest, denyFriendRequest } from '@/actions/friends'
import { Tables } from '@/types/supabase'

import { Avatar } from './ui/avatar'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function FriendRequest({
  sender,
  friend_id,
}: {
	sender: Tables<'profiles'> | null;
	friend_id: number;
}) {
  return (
    <form>
      <Input
        readOnly
        aria-label='Friend ID'
        className='hidden'
        defaultValue={friend_id}
        name='friend-id'
        type="number"
      />
      <div className='flex flex-col gap-y-4 py-4'>
        <Link className='flex items-center gap-x-2' href={`/${sender?.username}`}>
          <Avatar size={'sm'} />
          <p className='text-sm'>
            <span className='font-medium'>
              {`${sender?.first_name} ${sender?.last_name || ''}`}
              {/* {sender?.display_name} */}
            </span>
            wants to add you to friends
          </p>
        </Link>
        <div className='flex justify-between items-center gap-x-4'>
          <Button
            className='flex-1 rounded-full'
            formAction={acceptFriendRequest}
            size={'sm'}
          >
						Accept
          </Button>
          <Button
            className='flex-1 rounded-full'
            formAction={denyFriendRequest}
            size={'sm'}
            variant={'secondary'}
          >
						Decline
          </Button>
        </div>
      </div>
    </form>
  )
}
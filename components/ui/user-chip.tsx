import Link from 'next/link'

import { Tables } from '@/types/supabase'

import { Button } from './button'
import { Avatar } from './avatar'

export default function UserChip({
  user
  // avatar,
  // action,
  // name,
  // username,
}: {
	// avatar?: React.ReactNode,
	// action?: React.ReactNode,
	// title?: string,
	// subheader?: string | null,
  user: Tables<'profiles'>;
}) {
  return (
    // <div className='w-full max-w-xs flex justify-start items-center p-1 border rounded-full bg-background'>
    //   {avatar}
    //   <div className='flex-1 px-4'>
    //     <p>{title}</p>
    //     <p className='text-xs text-gray-500'>{subheader}</p>
    //   </div>
    //   {action}
    // </div>
    <Button asChild className='w-full h-fit rounded-full px-2' variant={'outline'}>
      <Link href={`/${user.username}`}>
        <Avatar url={user.avatar_url || ''} />
        <div className='flex-1 px-2'>
          <p>{user.display_name}</p>
          <p className='text-xs text-gray-500'>@{user.username}</p>
        </div>
      </Link>
    </Button>
  )
}
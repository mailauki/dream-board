import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import UserChip from '@/components/ui/user-chip'
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
      <Container className='mx-0' size={'sm'} variant={'column'}>
        {(!friends || friends.length === 0) ? (
          <div className='flex flex-1 justify-center py-8'>
            <p>No friends yet</p>
          </div>
        ) : (
          friends.map((friend) => (
            friend.to?.user_id === user?.id ? (
              <UserChip key={friend.id} user={friend.from!} />
            ) : (
              <UserChip key={friend.id} user={friend.to!} />
            )
          )))}
      </Container>
    </>
  )
}
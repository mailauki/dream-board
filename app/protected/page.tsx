import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import Profile from '@/components/user-profile'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <>
      {/* <Toolbar title='Protected'>
        <form action={signOutAction}>
          <Button type="submit" variant={'outline'}>
						Sign out
          </Button>
        </form>
      </Toolbar> */}
      {/* <Container variant={'column'}>
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
						This is a protected page that you can only see as an authenticated user
          </div>
        </div>
      </Container> */}
      <Profile profile={profile} />
    </>
  )
}

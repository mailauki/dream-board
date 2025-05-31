import { InfoIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import Toolbar from '@/components/layout/toolbar'
import { signOutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <>
      <Toolbar title='Protected'>
        <form action={signOutAction}>
          <Button type="submit" variant={'outline'}>
						Sign out
          </Button>
        </form>
      </Toolbar>
      <Container variant={'column'}>
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
						This is a protected page that you can only see as an authenticated user
          </div>
        </div>
      </Container>
    </>
  )
}

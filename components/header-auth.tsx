import Link from 'next/link'

import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import { createClient } from '@/utils/supabase/server'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'


export default async function AuthButton() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              className="font-normal pointer-events-none"
              variant={'default'}
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              disabled
              className="opacity-75 cursor-none pointer-events-none"
              size="sm"
              variant={'outline'}
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              disabled
              className="opacity-75 cursor-none pointer-events-none"
              size="sm"
              variant={'default'}
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.user_metadata.display_name || user.email}!
      <Link href='/account'>
        <Avatar size={'sm'} url={user.user_metadata.avatar_url} />
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild className='hidden lg:flex' size="sm" variant={'default'}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}

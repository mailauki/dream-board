import Link from 'next/link'

import { hasEnvVars } from '@/utils/supabase/check-env-vars'

import { EnvVarWarning } from './env-var-warning'
import HeaderAuth from './header-auth'
import { Container } from './layout/container'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 w-full flex justify-center border-b border-b-foreground/10 bg-background h-16">
      <Container className='text-sm' variant={'row'}>
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>Home</Link>
          <Link href={'/dreams'}>Dreams</Link>
          <Link href={'/friends'}>Friends</Link>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </Container>
    </nav>
  )
}
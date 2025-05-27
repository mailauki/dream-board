import Link from 'next/link'

import { hasEnvVars } from '@/utils/supabase/check-env-vars'

import { EnvVarWarning } from './env-var-warning'
import HeaderAuth from './header-auth'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 w-full flex justify-center border-b border-b-foreground/10 bg-background h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>Home</Link>
          <Link href={'/dreams'}>Dreams</Link>
          <Link href={'/friends'}>Friends</Link>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  )
}
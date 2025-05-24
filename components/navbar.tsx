import Link from 'next/link'

import { hasEnvVars } from '@/utils/supabase/check-env-vars'

import DeployButton from './deploy-button'
import { EnvVarWarning } from './env-var-warning'
import HeaderAuth from './header-auth'

export default function Navbar() {
  return (
  // <div className="flex justify-between items-center gap-x-4">
  // 	<div><h1></h1></div>
  // 	<img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="user-avatar" className="size-10 rounded-full bg-gray-50" />
  // </div>
    <nav className="sticky top-0 z-10 w-full flex justify-center border-b border-b-foreground/10 bg-background h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={'/'}>Next.js Supabase Starter</Link>
          <div className="flex items-center gap-2">
            <DeployButton />
          </div>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  )
}
import Link from 'next/link'

import { Badge } from './ui/badge'
import { Button } from './ui/button'

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge className="font-normal" variant={'outline'}>
        Supabase environment variables required
      </Badge>
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
  )
}

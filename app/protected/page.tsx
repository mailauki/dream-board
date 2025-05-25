import { InfoIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { Label } from '@/components/ui/label'
import { updateUser } from '@/actions/users'
import UploadAvatar from '@/components/upload-avatar'
import Toolbar from '@/components/toolbar'
import { signOutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const displayName = user.user_metadata.display_name
  const avatarUrl = user.user_metadata.avatar_url

  return (
    <>
      <Toolbar>
        <form action={signOutAction}>
          <Button type="submit" variant={'outline'}>
						Sign out
          </Button>
        </form>
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
          </div>
        </div>
      </Toolbar>
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          <div className="flex w-full max-w-xl flex-col items-start justify-between rounded border p-2">
            <UploadAvatar uid={user.id} url={avatarUrl} />
            <div className='w-full'>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                <Label htmlFor="display_name">Email</Label>
                <Input readOnly aria-label='User email' defaultValue={user.email || ''} name='email' placeholder='your-email@gmail.com' />
              </div>
            </div>
            <form className='w-full'>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                <Label htmlFor="display_name">Display name</Label>
                <Input aria-label='User display name' defaultValue={displayName || ''} name='display_name' placeholder='John Doe' />
              </div>
              <SubmitButton formAction={updateUser} pendingText="Updating user...">Update user</SubmitButton>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

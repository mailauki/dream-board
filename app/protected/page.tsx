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
import { TextArea } from '@/components/ui/textarea'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  // const displayName = user.user_metadata.display_name
  // const avatarUrl = user.user_metadata.avatar_url

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
						This is a protected page that you can only see as an authenticated user
          </div>
        </div>
      </Toolbar>
      <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
                <Label htmlFor="profile-id">Profile ID</Label>
                <Input
                  readOnly
                  defaultValue={profile?.id}
                  id='profile-id'
                  name='profile-id'
                  placeholder=''
                  type="number"
                />
              </div>

              <div className="col-span-full">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    defaultValue={profile?.username || ''}
                    id="username"
                    name="username"
                    placeholder="janesmith"
                    type="text"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor='about'>About</Label>
                  <TextArea
                    defaultValue={profile?.about || ''}
                    id="about"
                    name="about"
                    placeholder='Write a few sentences about yourself.'
                    rows={4}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor="photo">Avatar photo</Label>
                </div>
                <UploadAvatar uid={user.id} url={profile?.avatar_url} />
              </div>

              {/* <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900" htmlFor="cover-photo">Cover photo</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg aria-hidden="true" className="mx-auto size-12 text-gray-300" data-slot="icon" fill="currentColor" viewBox="0 0 24 24">
                      <path clipRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" fillRule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500" htmlFor="file-upload">
                        <span>Upload a file</span>
                        <input className="sr-only" id="file-upload" name="file-upload" type="file" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    autoComplete="given-name"
                    defaultValue={profile?.first_name || ''}
                    id="first-name"
                    name="first-name"
                    placeholder="Jane"
                    type="text"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    autoComplete="family-name"
                    defaultValue={profile?.last_name || ''}
                    id="last-name"
                    name="last-name"
                    placeholder="Smith"
                    type="text"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-3">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    readOnly
                    autoComplete="email"
                    defaultValue={user.email}
                    id="email"
                    name="email"
                    type="email"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button variant={'ghost'}>Cancel</Button>
          <SubmitButton
            formAction={updateUser}
            pendingText='Saving...'
          >
						Save
          </SubmitButton>
        </div>
      </form>

      {/* <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Your user details</h2>
          <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          <div className="flex w-full max-w-xl flex-col items-start justify-between rounded border p-2">
            <UploadAvatar uid={user.id} url={avatarUrl} />
            <div>Dreams: <span>{dreamsCount}</span></div>
            <div>Friends: <span>{friendsCount || 0}</span></div>
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
      </div> */}
    </>
  )
}

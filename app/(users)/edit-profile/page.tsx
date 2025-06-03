import { redirect } from 'next/navigation'
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'

import { updateUser } from '@/actions/users'
import { Container } from '@/components/layout/container'
import Toolbar from '@/components/layout/toolbar'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextArea } from '@/components/ui/textarea'
import UploadAvatar from '@/components/upload-avatar'
import { createClient } from '@/utils/supabase/server'

export default async function EditProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  // const displayName = user.user_metadata.display_name
  // const avatarUrl = user.user_metadata.avatar_url
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <>
      <Toolbar title='Profile'>
        {/* <form action={signOutAction}>
          <Button type="submit" variant={'outline'}>
						Sign out
          </Button>
        </form> */}
      </Toolbar>
      <form>
        <Container className='lg:grid-cols-2 gap-y-6' variant={'grid'}>
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center col-span-full w-full mt-3">
            <InfoIcon size="16" strokeWidth={2} />
						This information will be displayed publicly so be careful what you share.
          </div>

          <div className="col-span-full flex flex-col gap-2 [&>input]:mb-3 mt-3 hidden">
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

          <div className="col-span-full flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor='username'>Username</Label>
            <Input
              defaultValue={profile?.username || ''}
              id="username"
              name="username"
              placeholder="janesmith"
              type="text"
            />
          </div>

          <div className="col-span-full flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor='about'>About</Label>
            <TextArea
              defaultValue={profile?.about || ''}
              id="about"
              name="about"
              placeholder='Write a few sentences about yourself.'
              rows={4}
            />
          </div>

          <div className="col-span-full flex flex-col gap-2 [&>input]:mb-3 mt-3">
            <Label htmlFor="photo">Avatar photo</Label>
            <UploadAvatar uid={user.id} url={profile?.avatar_url} />
          </div>

          <div className="col-span-full lg:col-span-1 flex flex-col gap-2 [&>input]:mb-3 mt-3">
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

          <div className="col-span-full lg:col-span-1 flex flex-col gap-2 [&>input]:mb-3 mt-3">
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

          <div className="col-span-full flex flex-col gap-2 [&>input]:mb-3 mt-3">
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

          <div className="col-span-full flex items-center justify-end gap-x-6 my-6">
            <Button variant={'ghost'}>
              <Link href='/'>
                Cancel
              </Link>
            </Button>
            <SubmitButton
              formAction={updateUser}
              pendingText='Saving...'
            >
              Save
            </SubmitButton>
          </div>
        </Container>
      </form>
    </>
  )
}